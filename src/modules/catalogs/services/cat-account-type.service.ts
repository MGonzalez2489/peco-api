import { PageOptionsDto } from '@common/dtos/pagination';
import { BaseService } from '@common/services';
import { AccountType } from '@datasource/entities/catalogs';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountTypeEnum } from '../enums';

@Injectable()
export class CatAccountTypeService extends BaseService {
  constructor(
    @InjectRepository(AccountType)
    protected readonly catAccountTypeRepo: Repository<AccountType>,
  ) {
    super();
  }
  /**
   * Retrieves a paginated list of account types based on the provided pagination options.
   *
   * @param paginationDto The pagination options to use for retrieving the account types.
   * @returns A promise resolving to the paginated list of account types.
   */
  async getPaginatedAccountTypesAsync(paginationDto: PageOptionsDto) {
    const query = this.catAccountTypeRepo.createQueryBuilder();
    return this.SearchByQuery(query, paginationDto);
  }
  /**
   * Retrieves a list of all account types.   *
   * This method returns a list of all account types in the system. The list includes all available account types, including default and custom types.
   *
   * @returns A promise resolving to an array of `AccountType` objects.
   */
  async getAccountTypesAsync() {
    return await this.catAccountTypeRepo.find();
  }

  /**
   * Retrieves an account type by its value.
   *
   * @param value The value of the account type to retrieve.
   * @returns The account type with the matching value, or `undefined` if not found.
   */
  async getAccountTypeByValueAsync(value: AccountTypeEnum) {
    return await this.catAccountTypeRepo.findOneBy({ name: value.toString() });
  }

  async getAccountTypeByPublicIdAsync(publicId: string) {
    return await this.catAccountTypeRepo.findOneBy({ publicId });
  }
}
