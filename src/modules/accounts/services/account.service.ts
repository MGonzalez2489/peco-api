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
      });
      account = await this.repository.save(account);
      return account;
    } catch (error) {}
  }

  async getAccountById(id: string) {
    try {
      const account = this.repository.findOneBy({ publicId: id });
      return account;
    } catch (error) {}
  }

  async getAccountsByUserId(id: string) {
    try {
      const result = await this.repository.find({
        relations: { user: true },
        where: {
          user: {
            publicId: id,
          },
        },
      });
      return result;
    } catch (error) {}
  }
}
