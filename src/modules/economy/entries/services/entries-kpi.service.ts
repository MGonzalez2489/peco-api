import { CatEntryTypeService, CatEntryStatusService } from '@catalogs/services';
import { Entry } from '@datasource/entities/economy';
import { EntryCategoryService } from '@entry-category/services/entry-category.service';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';

@Injectable()
export class EntriesKpiService {
  constructor(
    @InjectRepository(Entry) readonly repository: Repository<Entry>,

    @Inject(EntryCategoryService)
    readonly categoryService: EntryCategoryService,
    @Inject(CatEntryTypeService)
    readonly catEntryTypeService: CatEntryTypeService,
    @Inject(CatEntryStatusService)
    readonly catEntryStatusService: CatEntryStatusService,
  ) {}

  async searchIncomesOutcomesKPIs(
    from: string,
    to: string,
    accountIds: number[],
  ) {
    try {
      const query = this.repository
        .createQueryBuilder('entry')
        .leftJoinAndSelect('entry.account', 'account')
        .leftJoinAndSelect('entry.category', 'category')
        .leftJoinAndSelect('entry.type', 'type')
        .where('entry.accountId IN (:...ids)', { ids: accountIds })
        .andWhere({
          createdAt: MoreThanOrEqual(new Date(from)),
        })
        .andWhere({
          createdAt: LessThanOrEqual(new Date(to)),
        });

      return query.getMany();
    } catch (error) {}
  }
}
