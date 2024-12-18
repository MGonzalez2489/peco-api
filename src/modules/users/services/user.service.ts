import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/datasource/entities';
import { Repository } from 'typeorm';
import { UserCreateDto } from '../dto';
import { AccountService } from 'src/modules/accounts/services/account.service';
import { BaseService, CryptService } from 'src/common/services';
import { UserConstants } from 'src/common/constants';

@Injectable()
export class UserService extends BaseService<User> {
  constructor(
    @InjectRepository(User) protected readonly repository: Repository<User>,
    @Inject(AccountService) private readonly accountService: AccountService,
    @Inject(CryptService) private readonly cryptoService: CryptService,
  ) {
    super(repository);
  }

  async findUserByEmail(email: string) {
    try {
      return this.repository.findOneBy({ email });
    } catch (error) {
      this.ThrowException('UserService::findUserByEmail', error);
    }
  }
  async findUserByPublicId(id: string) {
    try {
      return this.repository.findOneBy({ publicId: id });
    } catch (error) {
      this.ThrowException('UserService::findUserByPublicId', error);
    }
  }

  async create(dto: UserCreateDto) {
    try {
      const user = this.repository.create({
        email: dto.email,
        password: await this.cryptoService.encryptText(dto.password),
      });
      await this.repository.save(user);
      const newAccount = await this.accountService.createDefaultAccount(user);

      if (!user.accounts) {
        user.accounts = [];
      }

      user.accounts.push(newAccount);

      return user;
    } catch (error) {
      this.ThrowException('UserService::create', error);
    }
  }
  /**
   *@param newPassword New password value, it should be encrypted by auth service
   *@param userId User's publicId to update the value
   * // This Function is only used by auth service
   */
  async updatePassword(newPassword: string, userId: string) {
    try {
      const user = await this.findUserByPublicId(userId);

      return await this.repository.save({
        id: user.id,
        password: await this.cryptoService.encryptText(newPassword),
      });
    } catch (error) {
      this.ThrowException('UserService::updatePass', error);
    }
  }
}
