import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountConstants } from 'src/common/constants';
import { Account, User } from 'src/datasource/entities';
import { Repository } from 'typeorm';
import { CreateAccountDto } from '../dto';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account) private readonly repository: Repository<Account>,
  ) {}

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
  async getAccountsByUser(user: User) {
    try {
      const result = await this.repository.find({
        relations: { user: true },
        where: {
          user: {
            publicId: user.publicId,
          },
        },
      });
      return result;
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
    console.log('deleted account', account);

    await this.repository.save({
      id: account.id,
      name: dto.name,
      balance: dto.initialBalance,
    });
    return account;
  }
  async deleteAccount(accountId: string, user: User) {
    return await this.repository.softDelete({
      publicId: accountId,
      userId: user.id,
    });
  }
}
