import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntryTypeEnum } from 'src/common/enums';
import { Entry } from 'src/datasource/entities/entry.entity';
import { Repository } from 'typeorm';
import { CreateEntryDto } from '../dtos';
import { AccountService } from 'src/modules/accounts/services/account.service';

@Injectable()
export class EntriesService {
  constructor(
    @InjectRepository(Entry) private readonly repository: Repository<Entry>,
    @Inject(AccountService) private readonly accountService: AccountService,
  ) {}

  async createIncome(dto: CreateEntryDto, accountId: string) {
    try {
      const account = await this.accountService.getAccountById(accountId);

      const entry = this.repository.create({
        amount: dto.amount,
        description: dto.description,
        type: EntryTypeEnum.INCOME,
        account: account,
      });
      await this.repository.save(entry);
      return entry;
    } catch (error) {}
  }
  async createOutcome(dto: CreateEntryDto, accountId: string) {
    try {
      const account = await this.accountService.getAccountById(accountId);

      const entry = this.repository.create({
        amount: dto.amount,
        description: dto.description,
        type: EntryTypeEnum.OUTCOME,
        account: account,
      });
      await this.repository.save(entry);
      return entry;
    } catch (error) {}
  }
}
