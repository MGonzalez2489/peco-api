import { BaseService, CryptService } from '@common/services';
import { User } from '@datasource/entities';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateUserDto, UserCreateDto } from '../dto';
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

  /**
   * Finds a user by their email address.
   *
   * @param email The email address to search for.
   * @returns The user with the specified email address, or null if not found.
   * @throws {InternalServerErrorException} If an error occurs while searching for the user.
   */
  async findUserByEmailAsync(email: string): Promise<User | null> {
    try {
      return this.repository.findOneBy({ email });
    } catch (error) {
      this.ThrowException('UserService::findUserByEmail', error);
    }
  }
  /**
   * Finds a user by their public ID.
   *
   * @param id The public ID to search for.
   * @returns The user with the specified public ID, or null if not found.
   * @throws {InternalServerErrorException} If an error occurs while searching for the user.
   */
  async findUserByPublicIdAsync(publicId: string): Promise<User | null> {
    try {
      return this.repository.findOneBy({ publicId });
    } catch (error) {
      this.ThrowException('UserService::findUserByPublicId', error);
    }
  }

  /**
   * Creates a new user with the provided data.
   *
   * @param dto The user creation data transfer object.
   * @returns The newly created user.
   * @throws {InternalServerErrorException} If an error occurs while creating the user.
   */
  async createAsync(dto: UserCreateDto): Promise<User> {
    try {
      // Validate the input data
      if (!dto.email || !dto.password) {
        throw new BadRequestException('Email and password are required');
      }

      const user = this.repository.create({
        email: dto.email,
        password: await this.cryptoService.encryptText(dto.password),
      });
      await this.repository.save(user);

      // Seed all default info required for the user
      await this.userSeedService.seed(user);

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
  async updatePasswordAsync(newPassword: string, userId: string) {
    try {
      const user = await this.findUserByPublicIdAsync(userId);

      return await this.repository.save({
        id: user.id,
        password: await this.cryptoService.encryptText(newPassword),
      });
    } catch (error) {
      this.ThrowException('UserService::updatePass', error);
    }
  }

  async update(user: User, dto: UpdateUserDto) {
    await this.repository.save({
      ...user,
      firstName: dto.firstName,
      lastName: dto.lastName,
      dateOfBirth: dto.dateOfBirth,
    });
    return await this.repository.findOneBy({ id: user.id });
  }
}
