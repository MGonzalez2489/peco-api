import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService, CryptService } from 'src/common/services';
import { User } from 'src/datasource/entities';
import { Repository } from 'typeorm';
import { UserCreateDto } from '../dto';
import { UserSeedService } from './user-seed.service';

@Injectable()
export class UserService extends BaseService<User> {
  constructor(
    @InjectRepository(User) protected readonly repository: Repository<User>,
    @Inject(CryptService) private readonly cryptoService: CryptService,
    @Inject(UserSeedService) private readonly userSeedService: UserSeedService,
  ) {
    super(repository);
  }

  async findUserByEmailAsync(email: string) {
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

      //seed default info
      await this.userSeedService.seed(user);
      //categories

      // if (!user.accounts) {
      //   user.accounts = [];
      // }
      //
      // user.accounts.push(newAccount);

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
