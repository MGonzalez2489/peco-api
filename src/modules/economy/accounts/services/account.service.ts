import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/datasource/entities';
import { Like, Repository } from 'typeorm';
import { CreateAccountDto } from '../dto';
import { BaseService } from 'src/common/services';
import { PageOptionsDto } from 'src/common/dtos/pagination';
import { Account } from 'src/datasource/entities/economy/account.entity';
import { CatAccountTypeService } from 'src/modules/catalogs/services';

import * as AccountConstants from './../constants';

@Injectable()
export class AccountService extends BaseService<Account> {
  constructor(
    @InjectRepository(Account) readonly repository: Repository<Account>,
    @Inject(CatAccountTypeService)
    private readonly catAccountTypeService: CatAccountTypeService,
  ) {
    super(repository);
  }

  async createRootAccountAsync(user: User) {
    if (!user) {
      throw new BadRequestException('user is required');
    }

    try {
      const accountTypes =
        await this.catAccountTypeService.getAccountTypesAsync();
      const defaultAccountType = accountTypes.find(
        (accountType) =>
          accountType.name.toLowerCase() ===
          AccountConstants.DEFAULT_ACCOUNT_TYPE,
      );
      if (!defaultAccountType) {
        throw new InternalServerErrorException(
          'Default account type not found',
        );
      }

      let account = this.repository.create({
        name: AccountConstants.DEFAULT_NAME,
        user,
        balance: 0,
        initialBalance: 0,
        isDefault: true,
        isRoot: true,
        typeId: accountTypes.find(
          (f) => f.name.toLowerCase() === AccountConstants.DEFAULT_ACCOUNT_TYPE,
        ).id,
      });
      account = await this.repository.save(account);
      return account;
    } catch (error) {
      this.ThrowException('AccountService::createDefaultAccount', error);
    }
  }

  //Create an account
  //TODO: Improve documentation
  async createAccount(dto: CreateAccountDto, user: User) {
    try {
      let account = this.repository.create({
        name: dto.name,
        user,
        balance: dto.balance,
        initialBalance: dto.balance,
        isDefault: dto.isDefault,
      });
      account = await this.repository.save(account);
      return account;
    } catch (error) {
      this.ThrowException('AccountService::createAccount', error);
    }
  }

  /**
   * Retrieves an account by its public ID, optionally filtered by the provided user.
   *
   * @param publicId The public ID of the account to retrieve.
   * @param user The optional user object to filter accounts by.
   * @returns A promise resolving to the account with the specified public ID.
   * @throws {BadRequestException} If the public ID is not provided.
   */
  async getAccountByPublicIdAsync(publicId: string, user?: User) {
    if (!publicId) {
      throw new BadRequestException('Public ID is required');
    }
    try {
      const condition = {
        publicId,
      };
      if (user) {
        condition['userId'] = user.id;
      }

      const account = await this.repository.findOneBy(condition);
      return account;
    } catch (error) {
      this.ThrowException('AccountService::getAccountById', error);
    }
  }

  //Get accounts by user
  //TODO: Improve documentation
  async getAccountsByUser(pageOptionsDto: PageOptionsDto, user: User) {
    try {
      const filter = {
        userId: user.id,
      };

      //TODO: Fix the filter
      if (pageOptionsDto.hint && pageOptionsDto.hint !== '') {
        filter['name'] = Like(`%${pageOptionsDto.hint}%`);
      }
      return await this.Search(pageOptionsDto, filter);
    } catch (error) {
      this.ThrowException('AccountService::getAccountsByUser', error);
    }
  }

  //Update account balance
  //This function is only called from entry creation service
  //TODO: Improve documentation
  async updateAccountBalance(accountPrivateId: number, newBalance: number) {
    try {
      return await this.repository.save({
        id: accountPrivateId,
        balance: newBalance,
      });
    } catch (error) {
      this.ThrowException('AccountService::updateAccountBalance', error);
    }
  }

  async updateAccount(dto: CreateAccountDto, accountId: string, user: User) {
    try {
      const account = await this.getAccountByPublicIdAsync(accountId, user);
      if (!account) {
        throw new BadRequestException('Account not found');
      }

      const updatedValue = await this.repository.save({
        id: account.id,
        name: dto.name,
        isDefault: dto.isDefault,
        //balance: dto.initialBalance,
      });
      account.name = updatedValue.name;
      account.balance = updatedValue.balance;
      return account;
    } catch (error) {
      this.ThrowException('AccountService::updateAccount', error);
    }
  }
  /**
   *
   *
   */
  async deleteAccount(accountId: string, user: User) {
    try {
      const account = await this.getAccountByPublicIdAsync(accountId, user);

      if (account.isDefault) {
        throw new BadRequestException("Default account can't be deleted");
      }

      await this.repository.softDelete({
        publicId: accountId,
        userId: user.id,
      });
      return true;
    } catch (error) {
      this.ThrowException('AccountService::deleteAccount', error);
    }
  }
}
