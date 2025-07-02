import { AccountService } from '@accounts/services/account.service';
import { EntryStatusEnum, EntryTypeEnum } from '@catalogs/enums';
import { CatEntryStatusService, CatEntryTypeService } from '@catalogs/services';
import { BaseService } from '@common/services';
import { User } from '@datasource/entities';
import { Account, Entry, EntryCategory } from '@datasource/entities/economy';
import { CreateEntryDto } from '@entries/dtos';
import { SearchEntriesDto } from '@entries/dtos/search.dto';
import { EntryCategoryService } from '@entry-category/services/entry-category.service';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, Like, MoreThanOrEqual, Repository } from 'typeorm';

@Injectable()
export class EntryService extends BaseService {
  constructor(
    @InjectRepository(Entry) readonly repository: Repository<Entry>,
    @Inject(AccountService)
    readonly accountService: AccountService,
    @Inject(EntryCategoryService)
    readonly categoryService: EntryCategoryService,
    @Inject(CatEntryTypeService)
    readonly catEntryTypeService: CatEntryTypeService,
    @Inject(CatEntryStatusService)
    readonly catEntryStatusService: CatEntryStatusService,
  ) {
    super();
  }

  async getEntryById(publicId: string, user: User) {
    const entry = await this.repository.findOneBy({ publicId });
    if (!entry) {
      throw new NotFoundException(`No entry found with id ${publicId}`);
    }

    if (entry.account.userId !== user.id) {
      throw new UnauthorizedException('Aunauthorized information access');
    }

    return entry;
  }

  /**
   * Retrieves a list of entries by account, category, and entry type.
   *
   * @param searchDto The search DTO containing filtering and pagination details.
   * @param user The user who owns the account.
   * @returns A list of entries matching the specified criteria.
   * @throws {Exception} If an error occurs during entry retrieval.
   */
  async getEntriesByAccountAsync(searchDto: SearchEntriesDto, user: User) {
    try {
      // Retrieve the account, category, and entry type if specified
      const account = searchDto.accountId
        ? await this.accountService.getAccountByPublicIdAsync(
            searchDto.accountId,
            user,
          )
        : undefined;
      const category = searchDto.categoryId
        ? await this.categoryService.getByPublicIdAsync(
            searchDto.categoryId,
            user,
          )
        : undefined;
      const entryType = searchDto.entryTypeId
        ? await this.catEntryTypeService.getEntryTypeByPublicIdAsync(
            searchDto.entryTypeId,
          )
        : undefined;

      // Create a filter object to specify the account, category, and entry type
      const filter = {};
      if (account) {
        filter['accountId'] = account.id;
      }
      if (category) {
        filter['categoryId'] = category.id;
      }
      if (entryType) {
        filter['typeId'] = entryType.id;
      }
      if (searchDto.description) {
        filter['description'] = Like(`%${searchDto.description}%`);
      }

      // Create a query builder to retrieve the entries
      let query = this.repository.createQueryBuilder('entry');

      // Add joins and selects to retrieve related data
      query
        .leftJoinAndSelect('entry.account', 'account')
        .leftJoinAndSelect('entry.category', 'category')
        .leftJoinAndSelect('entry.type', 'type')
        .leftJoinAndSelect('entry.status', 'status')
        .where(filter)
        .andWhere('account.userId = :userId', { userId: user.id });

      if (searchDto.from && searchDto.to) {
        query = query
          .andWhere({
            createdAt: MoreThanOrEqual(new Date(searchDto.from)), //TODO: VERIFY UTC FORMAT/SEARCH
          })
          .andWhere({
            createdAt: LessThanOrEqual(new Date(searchDto.to)),
          });
      }

      query = query.orderBy(`entry.${searchDto.orderBy}`, searchDto.order);

      // Retrieve the entries from the database
      const response = await this.SearchByQuery(query, searchDto);

      return response;
    } catch (error) {
      this.ThrowException('EntriesService::getEntriesByAccount', error);
    }
  }

  async updateEntryAsync(entryId: string, dto: CreateEntryDto, user: User) {
    try {
      const entry = await this.repository.findOneBy({ publicId: entryId });
      if (!entry) {
        throw new BadRequestException('Entry not found');
      }

      if (entry.account.userId !== user.id) {
        throw new BadRequestException('Entry not related');
      }

      const updateObject = {};

      //entry type
      if (entry.type.publicId !== dto.entryTypeId) {
        const newEntryType =
          await this.catEntryTypeService.getEntryTypeByPublicIdAsync(
            dto.entryTypeId,
          );

        updateObject['typeId'] = newEntryType!.id;
        // entry.typeId = newEntryType!.id;
        // entry.type = newEntryType!;
      }
      //category
      if (entry.category.publicId !== dto.categoryId) {
        const newCat = await this.categoryService.getByPublicIdAsync(
          dto.categoryId,
          user,
        );
        updateObject['categoryId'] = newCat!.id;

        // entry.categoryId = newCat!.id;
        // entry.category = newCat!;
      }

      if (entry.description !== dto.description) {
        updateObject['description'] = dto.description;
      }
      // entry.description = dto.description;
      //account
      const account = entry.account;

      let newAccount: Account | null | undefined = undefined;
      if (entry.account.publicId !== dto.accountId) {
        newAccount = await this.accountService.getAccountByPublicIdAsync(
          dto.accountId,
        );
        updateObject['accountId'] = newAccount!.id;

        if (entry.type.name === EntryTypeEnum.Income.toString()) {
          account.balance -= entry.amount;
        }
        if (entry.type.name === EntryTypeEnum.Outcome.toString()) {
          account.balance += entry.amount;
        }

        const accToUpdate = newAccount ? newAccount : entry.account;
        let newAccBalance = Number(accToUpdate.balance);
        if (entry.type.name === EntryTypeEnum.Income.toString()) {
          newAccBalance = newAccBalance + Number(entry.amount);
        } else {
          newAccBalance = newAccBalance - Number(entry.amount);
        }

        await this.accountService.updateAccountBalanceAsync(
          accToUpdate.id,
          newAccBalance,
        );

        await this.accountService.repository.save(account);
      }

      if (Number(entry.amount) !== Number(dto.amount)) {
        // entry.amount = dto.amount;
        updateObject['amount'] = dto.amount;
      }

      console.log('obj to update', updateObject);
      await this.repository
        .createQueryBuilder()
        .update(Entry)
        .set(updateObject)
        .where('id = :id', { id: entry.id })
        .execute();
      // return await this.repository.save(entry);
    } catch (error) {
      this.ThrowException('EntriesService::updateEntryAsync', error);
    }
  }
  async createEntryAsync(dto: CreateEntryDto, user: User) {
    try {
      const account = await this.accountService.getAccountByPublicIdAsync(
        dto.accountId,
        user,
      );
      if (!account) {
        throw new BadRequestException('Account not found');
      }

      if (account.userId !== user.id) {
        throw new UnauthorizedException();
      }

      const category = await this.categoryService.getByPublicIdAsync(
        dto.categoryId,
        user,
      );

      const entryType =
        await this.catEntryTypeService.getEntryTypeByPublicIdAsync(
          dto.entryTypeId,
        );

      const entryStatus =
        await this.catEntryStatusService.getEntryStatusByValueAsync(
          EntryStatusEnum.Applied,
        );

      const entry = this.repository.create({
        amount: dto.amount,
        description: dto.description,
        prevAccBalance: account.balance,
        typeId: entryType!.id,
        accountId: account.id,
        categoryId: category!.id,
        statusId: entryStatus!.id,
      });

      await this.repository.save(entry);

      let newAccBalance = Number(account.balance);
      if (entryType!.name === EntryTypeEnum.Income.toString()) {
        newAccBalance = newAccBalance + Number(entry.amount);
      } else {
        newAccBalance = newAccBalance - Number(entry.amount);
      }

      await this.accountService.updateAccountBalanceAsync(
        account.id,
        newAccBalance,
      );
      return entry;
    } catch (error) {
      this.ThrowException('EntriesService::createEntryAsync', error);
    }
  }

  async getEntriesStats(searchDto: SearchEntriesDto, user: User) {
    const query = await this.generateQueryWithFilters(searchDto, user);
    const result = await query.getMany();

    const grouped: {
      [key: string]: { category: EntryCategory; count: number };
    } = {};

    for (const entry of result) {
      const categoryPublicId = entry.category.parent
        ? entry.category?.parent?.publicId
        : entry.category?.publicId;
      const category = entry.category.parent
        ? entry.category.parent
        : entry.category;

      if (categoryPublicId && category) {
        if (grouped[categoryPublicId]) {
          grouped[categoryPublicId].count++;
        } else {
          grouped[categoryPublicId] = { category: category, count: 1 };
        }
      }
    }

    return Object.values(grouped);
  }

  async reassignEntriesToAccount(oldAccountId: number, newAccountId: number) {
    const { sum } = await this.repository
      .createQueryBuilder('entry')
      .leftJoinAndSelect('entry.type', 'type')
      .select(
        `SUM(CASE
        WHEN type.name = 'income' THEN entry.amount
        WHEN type.name = 'outcome' THEN -entry.amount
        ELSE 0
      END)`,
        'sum', // El alias para el resultado de la suma
      )
      .where('accountId = :accountId', { accountId: oldAccountId })
      .getRawOne();

    await this.repository
      .createQueryBuilder()
      .update(Entry)
      .set({ accountId: newAccountId })
      .where('accountId = :accountId', { accountId: oldAccountId })
      .execute();

    return Number(sum);
  }

  async deleteEntry(id: string, user: User) {
    const entry = await this.getEntryById(id, user);
    if (!entry) {
      throw new NotFoundException(`No entry found with id ${id}`);
    }

    await this.repository.softDelete({
      publicId: entry.publicId,
      id: entry.id,
    });

    let newAccBalance = entry.account.balance;
    if (entry.type.name === EntryTypeEnum.Income.toString()) {
      newAccBalance -= entry.amount;
    } else {
      newAccBalance += entry.amount;
    }

    await this.accountService.updateAccountBalanceAsync(
      entry.account.id,
      newAccBalance,
    );
    return true;
  }

  private async generateQueryWithFilters(
    searchDto: SearchEntriesDto,
    user: User,
  ) {
    // Retrieve the account, category, and entry type if specified
    const account = searchDto.accountId
      ? await this.accountService.getAccountByPublicIdAsync(
          searchDto.accountId,
          user,
        )
      : undefined;
    const category = searchDto.categoryId
      ? await this.categoryService.getByPublicIdAsync(
          searchDto.categoryId,
          user,
        )
      : undefined;
    const entryType = searchDto.entryTypeId
      ? await this.catEntryTypeService.getEntryTypeByPublicIdAsync(
          searchDto.entryTypeId,
        )
      : undefined;

    // Create a filter object to specify the account, category, and entry type
    const filter = {};
    if (account) {
      filter['accountId'] = account.id;
    }
    if (category) {
      filter['categoryId'] = category.id;
    }
    if (entryType) {
      filter['typeId'] = entryType.id;
    }
    if (searchDto.description) {
      filter['description'] = Like(`%${searchDto.description}%`);
    }
    //
    // Create a query builder to retrieve the entries
    const query = this.repository.createQueryBuilder('entry');

    // Add joins and selects to retrieve related data
    query
      .leftJoinAndSelect('entry.account', 'account')
      .leftJoinAndSelect('entry.category', 'category')
      .leftJoinAndSelect('category.parent', 'parent')
      .leftJoinAndSelect('entry.type', 'type')
      .leftJoinAndSelect('entry.status', 'status')
      .where(filter)
      .andWhere('account.userId = :userId', { userId: user.id })
      .andWhere({
        createdAt: MoreThanOrEqual(new Date(searchDto.from)),
      })
      .andWhere({
        createdAt: LessThanOrEqual(new Date(searchDto.to)),
      })

      .orderBy(`entry.${searchDto.orderBy}`, searchDto.order);

    return query;
  }
}
