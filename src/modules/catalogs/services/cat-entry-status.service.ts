import { PageOptionsDto } from '@common/dtos/pagination';
import { BaseService } from '@common/services';
import { EntryStatus } from '@datasource/entities/catalogs';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EntryStatusEnum } from '../enums';

@Injectable()
export class CatEntryStatusService extends BaseService {
  constructor(
    @InjectRepository(EntryStatus)
    protected readonly catEntryStatusRepo: Repository<EntryStatus>,
  ) {
    super();
  }

  /**
   * Retrieves a paginated list of entry status based on the provided pagination options.
   *
   * @param paginationDto The pagination options to use for retrieving the entry status list.
   * @returns A promise resolving to the paginated list of entry status.
   */
  async getPaginatedEntryStatusAsync(paginationDto: PageOptionsDto) {
    const query = this.catEntryStatusRepo.createQueryBuilder();
    return this.SearchByQuery(query, paginationDto);
  }

  /**
   * Retrieves a list of all entry status.   *
   * This method returns a list of all entry status in the system. The list includes all available entry status, including default and custom types.
   *
   * @returns A promise resolving to an array of `EntryStatus` objects.
   */
  async getEntryStatusAsync() {
    return await this.catEntryStatusRepo.find();
  }

  /**
   * Retrieves an account type by its value.
   *
   * @param value The value of the account type to retrieve.
   * @returns The account type with the matching value, or `undefined` if not found.
   */
  async getEntryStatusByValueAsync(value: EntryStatusEnum) {
    return await this.catEntryStatusRepo.findOneBy({ name: value.toString() });
  }
}
