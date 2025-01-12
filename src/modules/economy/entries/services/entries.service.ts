import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { CreateEntryDto, EntryDto } from '../dtos';
import { User } from 'src/datasource/entities';
import { BaseService } from 'src/common/services';
import { PageOptionsDto } from 'src/common/dtos/pagination';
import { CatalogsService } from 'src/modules/catalogs/services/catalogs.service';
import { Entry } from 'src/datasource/entities/economy';
import { AccountService } from '../../accounts/services/account.service';
import { EntryCategoryService } from 'src/modules/catalogs/services/entry-category.service';

@Injectable()
export class EntriesService extends BaseService<Entry> {
  constructor(
    @InjectRepository(Entry) readonly repository: Repository<Entry>,
    @Inject(AccountService) private readonly accountService: AccountService,
    @Inject(EntryCategoryService)
    private readonly categoryService: EntryCategoryService,
    @Inject(CatalogsService) private readonly catalogsService: CatalogsService,
  ) {
    super(repository);
  }
  //TODO: Apply pagination
  async getEntriesByAccount(
    accountId: string,
    pageOptionsDto: PageOptionsDto,
    user: User,
  ) {
    try {
      const account = await this.accountService.getAccountById(accountId, user);
      if (!account) {
        throw new BadRequestException('Account not found');
      }

      const query = this.repository.createQueryBuilder('entry');

      const filter = {
        accountId: account.id,
      };
      if (pageOptionsDto.hint && pageOptionsDto.hint !== '') {
        filter['description'] = Like(`%${pageOptionsDto.hint}%`);
      }

      query
        .where(filter)
        .leftJoinAndSelect('entry.category', 'category')
        .leftJoinAndSelect('entry.type', 'type')
        .orderBy(`entry.${pageOptionsDto.orderBy}`, pageOptionsDto.order);

      const response = await this.SearchByQuery(query, pageOptionsDto);

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
      const account = await this.accountService.getAccountById(
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
      const entryType = await this.catalogsService.getEntryByPublicId(
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

      await this.accountService.updateAccountBalance(account.id, newAccBalance);
      return entry;
    } catch (error) {}
  }
}
