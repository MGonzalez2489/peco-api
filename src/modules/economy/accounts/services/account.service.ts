import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountConstants } from 'src/common/constants';
import { User } from 'src/datasource/entities';
import { Like, Repository } from 'typeorm';
import { CreateAccountDto } from '../dto';
import { BaseService } from 'src/common/services';
import { PageOptionsDto } from 'src/common/dtos/pagination';
import { Account } from 'src/datasource/entities/economy/account.entity';

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
        isDefault: true,
      };

      return await this.createAccount(defaultAccountDto, user);
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
        balance: dto.initialBalance,
        isDefault: dto.isDefault,
      });
      account = await this.repository.save(account);
      return account;
    } catch (error) {
      this.ThrowException('AccountService::createAccount', error);
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
      const account = await this.getAccountById(accountId, user);
      if (!account) {
        throw new BadRequestException('Account not found');
      }

      const updatedValue = await this.repository.save({
        id: account.id,
        name: dto.name,
        //balance: dto.initialBalance,
      });
      account.name = updatedValue.name;
      account.balance = updatedValue.balance;
      return account;
    } catch (error) {
      this.ThrowException('AccountService::updateAccount', error);
    }
  }
  async deleteAccount(accountId: string, user: User) {
    try {
      const account = await this.getAccountById(accountId, user);

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
