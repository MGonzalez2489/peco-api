import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageOptionsDto } from 'src/common/dtos/pagination';
import { BaseService } from 'src/common/services';
import { User } from 'src/datasource/entities';
import { PlannedEntry } from 'src/datasource/entities/economy/planned-entry.entity';
import { CatEntryTypeService } from 'src/modules/catalogs/services';
import { Repository } from 'typeorm';
import { EntryCategoryService } from '../../entry-category/services/entry-category.service';
import { PlannedEntryCreateDto } from '../dto/planned-entry.dto';

@Injectable()
export class PlannedEntriesService extends BaseService<PlannedEntry> {
  constructor(
    @InjectRepository(PlannedEntry)
    readonly repository: Repository<PlannedEntry>,

    @Inject(EntryCategoryService)
    readonly categoryService: EntryCategoryService,
    @Inject(CatEntryTypeService)
    readonly catEntryTypeService: CatEntryTypeService,
  ) {
    super(repository);
  }

  async getall(search: PageOptionsDto, user: User) {
    const filter = {
      userId: user.id,
    };

    return this.Search(search, filter);
  }

  async createAsync(dto: PlannedEntryCreateDto, user: User) {
    try {
      //validations
      //relations
      const category = await this.categoryService.getByPublicIdAsync(
        dto.categoryId,
        user,
      );

      const entryType =
        await this.catEntryTypeService.getEntryTypeByPublicIdAsync(
          dto.entryTypeId,
        );

      //creation
      const values = {
        description: dto.description,
        amount: dto.amount,
        frecuency: dto.frecuency,
        frecuencyEnd: dto.frecuencyEnd,
        startDate: dto.startDate,
        recurrency: dto.recurrency,
        endDate: dto.endDate,
        dayOfWeek: dto.dayOfWeek,
        dayOfMonth: dto.dayOfMonth,
        userId: user.id,
        typeId: entryType.id,
        categoryId: category.id,
      };
      const entry = this.repository.create(values);
      await this.repository.save(entry);
      //return
      return entry;
    } catch (error) {
      this.ThrowException('PLannedEntriesService::create', error);
    }
  }

  getEnumKeyByString<T extends { [key: string]: string }>(
    enumType: T,
    key: string,
  ) {
    const keys = Object.keys(enumType);
    if (keys.some((f) => f.toLowerCase() === key.toLowerCase())) {
      return key;
    } else {
      throw new Error(`Invalid enum key ${key}`);
    }
  }
}
