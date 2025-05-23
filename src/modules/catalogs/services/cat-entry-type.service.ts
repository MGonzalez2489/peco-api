import { PageOptionsDto } from '@common/dtos/pagination';
import { BaseService } from '@common/services';
import { EntryType } from '@datasource/entities/catalogs';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CatEntryTypeService extends BaseService<EntryType> {
  constructor(
    @InjectRepository(EntryType)
    protected readonly catEntryTypeRepo: Repository<EntryType>,
  ) {
    super(catEntryTypeRepo);
  }

  /**
   * Retrieves a paginated list of entry types based on the provided pagination options.
   * @param paginationDto The pagination options to use for retrieving the entry types.
   * @returns A promise resolving to the paginated list of entry types.
   */
  async getPaginatedEntryTypesAsync(paginationDto: PageOptionsDto) {
    return this.Search(paginationDto, {});
  }
  /**
   * Retrieves an entry type by its public ID.
   * @param publicId The public ID of the entry type to retrieve.
   * @returns A promise resolving to the entry type with the specified public ID.
   * @throws {NotFoundException} If no entry type is found with the specified public ID.
   */
  async getEntryTypeByPublicIdAsync(publicId: string) {
    return await this.catEntryTypeRepo.findOneBy({ publicId });
  }
}
