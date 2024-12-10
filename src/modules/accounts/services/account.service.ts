import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountConstants } from 'src/common/constants';
import { Account, User } from 'src/datasource/entities';
import { Repository } from 'typeorm';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account) private readonly repository: Repository<Account>,
  ) {}

  async createDefaultAccount(user: User) {
    try {
      let account = this.repository.create({
        name: AccountConstants.DEFAULT_NAME,
        user,
        balance: 0,
      });
      account = await this.repository.save(account);
      return account;
    } catch (error) {}
  }

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

  async updateAccountBalance(accountPrivateId: number, newBalance: number) {
    return await this.repository.save({
      id: accountPrivateId,
      balance: newBalance,
    });
  }
}
