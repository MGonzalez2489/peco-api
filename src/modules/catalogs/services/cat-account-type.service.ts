import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageOptionsDto } from 'src/common/dtos/pagination';
import { BaseService } from 'src/common/services';
import { AccountType } from 'src/datasource/entities/catalogs';
import { Repository } from 'typeorm';
import { AccountTypeEnum } from '../enums';

@Injectable()
export class CatAccountTypeService extends BaseService<AccountType> {
  constructor(
    @InjectRepository(AccountType)
    protected readonly catAccountTypeRepo: Repository<AccountType>,
  ) {
    super(catAccountTypeRepo);
  }
  /**
   * Retrieves a paginated list of account types based on the provided pagination options.
   *
   * @param paginationDto The pagination options to use for retrieving the account types.
   * @returns A promise resolving to the paginated list of account types.
   */
  async getPaginatedAccountTypesAsync(paginationDto: PageOptionsDto) {
    return this.Search(paginationDto, {});
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
  async getAccountTypeByValueAsync(
    value: AccountTypeEnum,
  ): Promise<AccountType | undefined> {
    return await this.catAccountTypeRepo.findOneBy({ name: value.toString() });
  }

  async getAccountTypeByPublicIdAsync(
    publicId: string,
  ): Promise<AccountType | undefined> {
    return await this.catAccountTypeRepo.findOneBy({ publicId });
  }
}
