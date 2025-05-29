import { AccountResponseKpiDto, AccountSearchKpiDto } from '@accounts/dto';
import { EntryTypeEnum } from '@catalogs/enums';
import { BaseService } from '@common/services';
import { GetPeriodByType } from '@common/utils';
import { User } from '@datasource/entities';
import { Account } from '@datasource/entities/economy';
import { EntriesKpiService } from '@entries/services';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AccountsKpiService extends BaseService {
  constructor(
    @InjectRepository(Account) readonly repository: Repository<Account>,
    @Inject(EntriesKpiService)
    private readonly entriesKpiService: EntriesKpiService,
  ) {
    super();
  }

  async getGeneralKPIs(filters: AccountSearchKpiDto, user: User) {
    try {
      let accounts: Account[] = [];
      if (filters.accountId) {
        const acc = await this.repository.findOneBy({
          publicId: filters.accountId,
          userId: user.id,
        });
        if (acc) {
          accounts.push(acc);
        }
      }

      if (accounts.length === 0) {
        accounts = await this.repository.findBy({ userId: user.id });
      }

      if (accounts.length === 0) {
        throw new InternalServerErrorException('No accounts found');
      }

      const accIds = accounts.map((f) => f.id);

      const period = GetPeriodByType(filters.periodType);

      const resEntries = await this.entriesKpiService.searchIncomesOutcomesKPIs(
        period.from,
        period.to,
        accIds,
      );
      const incomes = resEntries!.filter(
        (f) => f.type.name === EntryTypeEnum.Income.toString(),
      );
      const incomesTotalAmout = incomes.reduce(
        (p: number, c) => p + Number(c.amount),
        0,
      );
      const outcomes = resEntries!.filter(
        (f) => f.type.name === EntryTypeEnum.Outcome.toString(),
      );
      const outcomesTotalAmount = outcomes.reduce(
        (p: number, c) => Number(p) + Number(c.amount),
        0,
      );

      const result: AccountResponseKpiDto = {
        period: period,
        incomes: {
          totalAmount: incomesTotalAmout,
          totalCount: incomes.length,
        },
        outcomes: {
          totalAmount: outcomesTotalAmount,
          totalCount: outcomes.length,
        },
      };
      return result;
    } catch (error) {
      this.ThrowException('AccountKpiService::getGeneralKPIs', error);
    }
  }
}
