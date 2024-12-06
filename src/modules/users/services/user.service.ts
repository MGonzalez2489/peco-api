import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/datasource/entities';
import { Repository } from 'typeorm';
import { UserCreateDto } from '../dto';
import { AccountService } from 'src/modules/accounts/services/account.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly repository: Repository<User>,
    @Inject(AccountService) private readonly accountService: AccountService,
  ) {}

  async create(dto: UserCreateDto) {
    try {
      const user = this.repository.create({
        email: dto.email,
      });
      await this.repository.save(user);
      const newAccount = await this.accountService.createDefaultAccount(user);

      if (!user.accounts) {
        user.accounts = [];
      }

      user.accounts.push(newAccount);

      return user;
    } catch (error) {
      console.log('error al crear usuario', error);
    }
  }
}
