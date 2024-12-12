import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntryTypeEnum } from 'src/common/enums';
import { Entry } from 'src/datasource/entities/entry.entity';
import { Repository } from 'typeorm';
import { CreateEntryDto } from '../dtos';
import { AccountService } from 'src/modules/accounts/services/account.service';
import { User } from 'src/datasource/entities';
import { BaseService } from 'src/common/services';
import { PageOptionsDto } from 'src/common/dtos/pagination';

@Injectable()
export class EntriesService extends BaseService<Entry> {
  constructor(
    @InjectRepository(Entry) readonly repository: Repository<Entry>,
    @Inject(AccountService) private readonly accountService: AccountService,
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

      return await this.Search(pageOptionsDto, { accountId: account.id });

      // const entries = await this.repository.findBy({ accountId: account.id });
      // return entries;
    } catch (error) {
      this.ThrowException('EntriesService::getEntriesByAccount', error);
    }
  }

  async createIncome(dto: CreateEntryDto, accountId: string, user: User) {
    try {
      const account = await this.accountService.getAccountById(accountId, user);
      if (!account) {
        throw new BadRequestException('Account not found');
      }

      if (account.userId !== user.id) {
        throw new UnauthorizedException();
      }

      const entry = this.repository.create({
        amount: dto.amount,
        description: dto.description,
        type: EntryTypeEnum.INCOME,
        account: account,
      });
      await this.repository.save(entry);
      const newAccBalance = account.balance + dto.amount;
      await this.accountService.updateAccountBalance(account.id, newAccBalance);
      return entry;
    } catch (error) {
      this.ThrowException('EntriesService::createIncome', error);
    }
  }
  async createOutcome(dto: CreateEntryDto, accountId: string, user: User) {
    try {
      const account = await this.accountService.getAccountById(accountId, user);
      if (!account) {
        throw new BadRequestException('Account not found');
      }

      if (account.userId !== user.id) {
        throw new UnauthorizedException();
      }

      const entry = this.repository.create({
        amount: dto.amount,
        description: dto.description,
        type: EntryTypeEnum.OUTCOME,
        account: account,
      });
      await this.repository.save(entry);
      const newAccBalance = account.balance - dto.amount;
      await this.accountService.updateAccountBalance(account.id, newAccBalance);

      return entry;
    } catch (error) {
      this.ThrowException('EntriesService::createOutcome', error);
    }
  }
}
