import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/services';
import { User } from 'src/datasource/entities';
import { Entry } from 'src/datasource/entities/economy';
import { CatEntryTypeService } from 'src/modules/catalogs/services';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { AccountService } from '../../accounts/services/account.service';
import { EntryCategoryService } from '../../entry-category/services/entry-category.service';
import { CreateEntryDto, EntryDto } from '../dtos';
import { SearchEntriesDto } from '../dtos/search.dto';

@Injectable()
export class EntryService extends BaseService<Entry> {
  constructor(
    @InjectRepository(Entry) readonly repository: Repository<Entry>,
    @Inject(AccountService) readonly accountService: AccountService,
    @Inject(EntryCategoryService)
    readonly categoryService: EntryCategoryService,
    @Inject(CatEntryTypeService)
    readonly catEntryTypeService: CatEntryTypeService,
  ) {
    super(repository);
  }

  async getEntriesByAccount(searchDto: SearchEntriesDto, user: User) {
    try {
      //Query
      const query = this.repository.createQueryBuilder('entry');
      const account = searchDto.accountId
        ? await this.accountService.getAccountByPublicIdAsync(
            searchDto.accountId,
            user,
          )
        : undefined;

      const category = searchDto.categoryId
        ? await this.categoryService.getByPublicId(searchDto.categoryId, user)
        : undefined;
      const entryType = searchDto.entryTypeId
        ? await this.catEntryTypeService.getEntryTypeByPublicIdAsync(
            searchDto.entryTypeId,
          )
        : undefined;

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

      query
        .leftJoinAndSelect('entry.account', 'account')
        .leftJoinAndSelect('entry.category', 'category')
        .leftJoinAndSelect('entry.type', 'type')
        .where(filter)
        .andWhere({
          createdAt: MoreThanOrEqual(new Date(searchDto.fromDate)),
        })
        .andWhere({
          createdAt: LessThanOrEqual(new Date(searchDto.toDate)),
        })
        .orderBy(`entry.${searchDto.orderBy}`, searchDto.order);

      const response = await this.SearchByQuery(query, searchDto);

      const mappedData: EntryDto[] = [];
      response.data.forEach((element: Entry) => {
        mappedData.push(new EntryDto(element));
      });

      response.data = mappedData;

      return response;
    } catch (error) {
      this.ThrowException('EntriesService::getEntriesByAccount', error);
    }
  }

  //crear un metodo para crear todo tipo de categoria
  async createEntry(dto: CreateEntryDto, accountPublicId: string, user: User) {
    try {
      const account = await this.accountService.getAccountByPublicIdAsync(
        accountPublicId,
        user,
      );
      if (!account) {
        throw new BadRequestException('Account not found');
      }

      if (account.userId !== user.id) {
        throw new UnauthorizedException();
      }

      const category = await this.categoryService.getByPublicId(
        dto.categoryId,
        user,
      );
      const entryType =
        await this.catEntryTypeService.getEntryTypeByPublicIdAsync(
          dto.entryTypeId,
        );

      const entry = this.repository.create({
        amount: dto.amount,
        description: dto.description,
        typeId: entryType.id,
        account: account,
        categoryId: category.id,
      });
      await this.repository.save(entry);
      let newAccBalance = account.balance;
      if (entryType.name === 'income') {
        newAccBalance += entry.amount;
      } else {
        newAccBalance -= entry.amount;
      }

      await this.accountService.updateAccountBalanceAsync(
        account.id,
        newAccBalance,
      );
      return entry;
    } catch (error) {}
  }
}
