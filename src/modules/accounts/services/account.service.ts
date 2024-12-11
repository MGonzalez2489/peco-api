import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountConstants } from 'src/common/constants';
import { Account, User } from 'src/datasource/entities';
import { Repository } from 'typeorm';
import { CreateAccountDto } from '../dto';
import { BaseService } from 'src/common/services';
import { PageOptionsDto } from 'src/common/dtos/pagination';

@Injectable()
export class AccountService extends BaseService<Account> {
  constructor(
    @InjectRepository(Account) readonly repository: Repository<Account>,
  ) {
    super(repository);
  }

  //Create one initial and default account
  //THis function is used only on usersCreate
  //TODO: Improve documentation
  async createDefaultAccount(user: User) {
    try {
      const defaultAccountDto: CreateAccountDto = {
        name: AccountConstants.DEFAULT_NAME,
        initialBalance: 0,
      };

      return await this.createAccount(defaultAccountDto, user);
    } catch (error) {
      console.log('AccountService::createDefaultAccount', error);
    }
  }

  //Create an account
  //TODO: Improve documentation
  async createAccount(dto: CreateAccountDto, user: User) {
    try {
      let account = this.repository.create({
        name: dto.name,
        user,
        balance: dto.initialBalance,
      });
      account = await this.repository.save(account);
      return account;
    } catch (error) {
      console.log('AccountService::createAccount', error);
    }
  }

  //Get account by id
  //TODO: Improve documentation
  async getAccountById(id: string, user?: User) {
    try {
      const condition = {
        publicId: id,
      };
      if (user) {
        condition['userId'] = user.id;
      }

      const account = await this.repository.findOneBy(condition);
      return account;
    } catch (error) {
      console.log('AccountService::getAccountById', error);
    }
  }

  //Get accounts by user
  //TODO: Improve documentation
  async getAccountsByUser(pageOptionsDto: PageOptionsDto, user: User) {
    try {
      return await this.Search(pageOptionsDto, { userId: user.id });
    } catch (error) {}
  }

  //Update account balance
  //This function is only called from entry creation service
  //TODO: Improve documentation
  async updateAccountBalance(accountPrivateId: number, newBalance: number) {
    return await this.repository.save({
      id: accountPrivateId,
      balance: newBalance,
    });
  }

  async updateAccount(dto: CreateAccountDto, accountId: string, user: User) {
    const account = await this.getAccountById(accountId, user);

    const updatedValue = await this.repository.save({
      id: account.id,
      name: dto.name,
      balance: dto.initialBalance,
    });
    account.name = updatedValue.name;
    account.balance = updatedValue.balance;
    return account;
  }
  async deleteAccount(accountId: string, user: User) {
    await this.repository.softDelete({
      publicId: accountId,
      userId: user.id,
    });
    return true;
  }
}
