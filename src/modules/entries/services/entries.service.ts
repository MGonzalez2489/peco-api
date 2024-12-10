import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntryTypeEnum } from 'src/common/enums';
import { Entry } from 'src/datasource/entities/entry.entity';
import { Repository } from 'typeorm';
import { CreateEntryDto } from '../dtos';
import { AccountService } from 'src/modules/accounts/services/account.service';
import { User } from 'src/datasource/entities';

@Injectable()
export class EntriesService {
  constructor(
    @InjectRepository(Entry) private readonly repository: Repository<Entry>,
    @Inject(AccountService) private readonly accountService: AccountService,
  ) {}

  async getEntriesByAccount(accountId: string, user: User) {
    const account = await this.accountService.getAccountById(accountId, user);

    const entries = await this.repository.findBy({ accountId: account.id });
    return entries;
  }

  async createIncome(dto: CreateEntryDto, accountId: string, user: User) {
    try {
      const account = await this.accountService.getAccountById(accountId, user);

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
      console.log('create income', error);
    }
  }
  async createOutcome(dto: CreateEntryDto, accountId: string, user: User) {
    try {
      const account = await this.accountService.getAccountById(accountId, user);

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
    } catch (error) {}
  }
}
