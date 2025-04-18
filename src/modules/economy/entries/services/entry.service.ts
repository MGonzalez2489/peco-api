import { EntryStatusEnum, EntryTypeEnum } from '@catalogs/enums';
import { CatEntryStatusService, CatEntryTypeService } from '@catalogs/services';
import { PaginatedResponseDto } from '@common/dtos/pagination';
import { BaseService } from '@common/services';
import { User } from '@datasource/entities';
import { Entry } from '@datasource/entities/economy';
import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountService } from '../../accounts/services/account.service';
import { EntryCategoryService } from '../../entry-category/services/entry-category.service';
import { CreateEntryDto, EntryDto } from '../dtos';
import { SearchEntriesDto } from '../dtos/search.dto';

@Injectable()
export class EntryService extends BaseService<Entry> {
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
    super(repository);
  }

  /**
   * Retrieves a list of entries by account, category, and entry type.
   *
   * @param searchDto The search DTO containing filtering and pagination details.
   * @param user The user who owns the account.
   * @returns A list of entries matching the specified criteria.
   * @throws {Exception} If an error occurs during entry retrieval.
   */
  async getEntriesByAccountAsync(
    searchDto: SearchEntriesDto,
    user: User,
  ): Promise<PaginatedResponseDto<EntryDto>> {
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
      //
      // Create a query builder to retrieve the entries
      const query = this.repository.createQueryBuilder('entry');

      // Add joins and selects to retrieve related data
      query
        .leftJoinAndSelect('entry.account', 'account')
        .leftJoinAndSelect('entry.category', 'category')
        .leftJoinAndSelect('entry.type', 'type')
        .leftJoinAndSelect('entry.status', 'status')
        .where(filter)
        .andWhere('account.userId = :userId', { userId: user.id })
        .orderBy(`entry.${searchDto.orderBy}`, searchDto.order);

      // Retrieve the entries from the database
      const response = await this.SearchByQuery(query, searchDto);

      // Map the response data to the EntryDto type
      const mappedData: EntryDto[] = response.data.map(
        (entry: Entry) => new EntryDto(entry),
      );
      response.data = mappedData;

      return response;
    } catch (error) {
      this.ThrowException('EntriesService::getEntriesByAccount', error);
    }
  }

  /**
   * Creates a new entry for the given account.
   *
   * @param {CreateEntryDto} dto - The entry data transfer object.
   * @param {User} user - The current user.
   * @returns {Promise<Entry>} The created entry.
   */
  async createEntryAsync(dto: CreateEntryDto, user: User): Promise<Entry> {
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
        type: entryType,
        account: account,
        category: category,
        status: entryStatus,
      });

      await this.repository.save(entry);

      let newAccBalance = account.balance;
      if (entryType.name === EntryTypeEnum.Income.toString()) {
        newAccBalance += entry.amount;
      } else {
        newAccBalance -= entry.amount;
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
}
