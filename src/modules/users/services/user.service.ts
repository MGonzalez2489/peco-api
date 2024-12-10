import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/datasource/entities';
import { Repository } from 'typeorm';
import { UserCreateDto } from '../dto';
import { AccountService } from 'src/modules/accounts/services/account.service';
import { CryptService } from 'src/common/services';
import { UserConstants } from 'src/common/constants';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly repository: Repository<User>,
    @Inject(AccountService) private readonly accountService: AccountService,
    @Inject(CryptService) private readonly cryptoService: CryptService,
  ) {}

  async findUserByEmail(email: string) {
    return this.repository.findOneBy({ email });
  }
  async findUserByPublicId(id: string) {
    return this.repository.findOneBy({ publicId: id });
  }

  async create(dto: UserCreateDto) {
    try {
      const user = this.repository.create({
        email: dto.email,
        password: await this.cryptoService.encryptText(
          UserConstants.DEFAULT_PASSWORD,
        ),
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
  /**
   *@param newPassword New password value, it should be encrypted by auth service
   *@param userId User's publicId to update the value
   * // This Function is only used by auth service
   */
  async updatePassword(newPassword: string, userId: string) {
    const user = await this.findUserByPublicId(userId);

    return await this.repository.save({
      id: user.id,
      password: await this.cryptoService.encryptText(newPassword),
    });
  }
}
