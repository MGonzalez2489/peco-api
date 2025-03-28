import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { CreateAccountDto } from '../dto';

import { AccountTypeEnum } from '@catalogs/enums';
import { CatAccountTypeService } from '@catalogs/services';
import { PageOptionsDto, PaginatedResponseDto } from '@common/dtos/pagination';
import { BaseService } from '@common/services';
import { User } from '@datasource/entities';
import { Account } from '@datasource/entities/economy';
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
  /**
   * Creates a root account for a given user.
   *
   * @param user The user to create a root account for.
   * @returns The created root account.
   * @throws {BadRequestException} If the user is not provided.
   * @throws {InternalServerErrorException} If the default account type is not found.
   */
  async createRootAccountAsync(user: User): Promise<Account> {
    if (!user) {
      throw new BadRequestException('user is required');
    }

    try {
      const cashAccountType =
        await this.catAccountTypeService.getAccountTypeByValueAsync(
          AccountTypeEnum.Cash,
        );

      let account = this.repository.create({
        name: AccountConstants.DEFAULT_NAME,
        user,
        balance: 0,
        initialBalance: 0,
        isDefault: true,
        isRoot: true,
        typeId: cashAccountType.id,
      });
      account = await this.repository.save(account);
      return account;
    } catch (error) {
      this.ThrowException('AccountService::createDefaultAccount', error);
    }
  }

  /**
   * Creates a new account based on the provided DTO.
   *
   * @param dto The data transfer object containing the account details.
   * @param user The user who owns the account.
   * @returns The created account.
   * @throws {Exception} If an error occurs during account creation.
   */
  async createAccountAsync(
    dto: CreateAccountDto,
    user: User,
  ): Promise<Account> {
    try {
      const accountType =
        await this.catAccountTypeService.getAccountTypeByPublicIdAsync(
          dto.accountTypeId,
        );

      //aqui
      let account = this.repository.create({
        name: dto.name,
        user,
        balance: dto.balance,
        initialBalance: dto.balance,
        isDefault: dto.isDefault,
        typeId: accountType.id,
      });
      account = await this.repository.save(account);
      account.type = accountType;
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

  /**
   * Retrieves a list of accounts owned by the specified user.
   *
   * @param pageOptionsDto The page options DTO containing filtering and pagination details.
   * @param user The user whose accounts are to be retrieved.
   * @returns A list of accounts matching the specified criteria.
   * @throws {Exception} If an error occurs during account retrieval.
   */
  async getAccountsByUserAsync(
    pageOptionsDto: PageOptionsDto,
    user: User,
  ): Promise<PaginatedResponseDto<Account>> {
    try {
      const filter = {
        userId: user.id,
      };

      if (pageOptionsDto.hint && pageOptionsDto.hint !== '') {
        filter['name'] = Like(`%${pageOptionsDto.hint}%`);
      }

      const queryBuilder = this.repository
        .createQueryBuilder('t')
        .leftJoinAndSelect('t.type', 'accountType')
        .where(filter)
        .orderBy(`t.${pageOptionsDto.orderBy}`, pageOptionsDto.order);

      return await this.SearchByQuery(queryBuilder, pageOptionsDto);
    } catch (error) {
      this.ThrowException('AccountService::getAccountsByUser', error);
    }
  }

  /**
   * Updates the balance of an account by its private ID.
   *
   * @param id The private ID of the account to update.
   * @param newBalance The new balance to set for the account.
   * @returns The updated account.
   * @throws {Exception} If an error occurs during account balance update.
   */
  async updateAccountBalanceAsync(
    id: number,
    newBalance: number,
  ): Promise<Account> {
    try {
      return await this.repository.save({
        id: id,
        balance: newBalance,
      });
    } catch (error) {
      this.ThrowException('AccountService::updateAccountBalance', error);
    }
  }

  /**
   * Updates an account by its public ID.
   *
   * @param dto The data transfer object containing the updated account details.
   * @param accountId The public ID of the account to update.
   * @param user The user who owns the account.
   * @returns The updated account.
   * @throws {BadRequestException} If the account is not found.
   * @throws {Exception} If an error occurs during account update.
   */
  async updateAccountAsync(
    dto: CreateAccountDto,
    accountId: string,
    user: User,
  ): Promise<Account> {
    try {
      const account = await this.getAccountByPublicIdAsync(accountId, user);
      if (!account) {
        throw new BadRequestException('Account not found');
      }
      const accountType =
        await this.catAccountTypeService.getAccountTypeByPublicIdAsync(
          dto.accountTypeId,
        );

      await this.repository.save({
        ...account,
        name: dto.name,
        isDefault: dto.isDefault,
        type: accountType,
      });

      //TODO: It is needed to create a mechanism to update the balance
      //in case of required creating an entry

      return await this.getAccountByPublicIdAsync(accountId, user);
    } catch (error) {
      this.ThrowException('AccountService::updateAccount', error);
    }
  }

  /**
   * Performs a soft delete on an account by its public ID.
   *
   * @param publicId The public ID of the account to delete.
   * @param user The user who owns the account.
   * @returns `true` if the account was successfully deleted, or `false` if an error occurred.
   * @throws {BadRequestException} If the account is the default account.
   * @throws {Exception} If an error occurs during account deletion.
   */
  async deleteAccount(publicId: string, user: User): Promise<boolean> {
    try {
      const account = await this.getAccountByPublicIdAsync(publicId, user);

      if (account.isDefault) {
        throw new BadRequestException("Default account can't be deleted");
      }

      await this.repository.softDelete({
        publicId: publicId,
        userId: user.id,
      });
      return true;
    } catch (error) {
      this.ThrowException('AccountService::deleteAccount', error);
    }
  }
}
