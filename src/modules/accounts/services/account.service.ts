import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
        name: 'default',
        user,
      });
      account = await this.repository.save(account);
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
