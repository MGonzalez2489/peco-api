import { CryptService } from '@common/services';
import { User } from '@datasource/entities';
import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateUserDto, UserCreateDto } from '../dto';
import { UserSeedService } from './user-seed.service';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let repository: Repository<User>;
  let cryptService: CryptService;
  let userSeedService: UserSeedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOneBy: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: CryptService,
          useValue: {
            encryptText: jest.fn(),
          },
        },
        {
          provide: UserSeedService,
          useValue: {
            seed: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
    cryptService = module.get<CryptService>(CryptService);
    userSeedService = module.get<UserSeedService>(UserSeedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
    expect(cryptService).toBeDefined();
    expect(userSeedService).toBeDefined();
  });

  describe('findUserByEmailAsync', () => {
    it('should call findOneBy with the provided email', async () => {
      const email = 'test@example.com';
      await service.findUserByEmailAsync(email);
      expect(repository.findOneBy).toHaveBeenCalledWith({ email });
    });

    it('should return the result of findOneBy', async () => {
      const email = 'test@example.com';
      const expectedResult = { id: 1, email } as User;
      (repository.findOneBy as jest.Mock).mockResolvedValue(expectedResult);

      const result = await service.findUserByEmailAsync(email);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findUserByPublicIdAsync', () => {
    it('should call findOneBy with the provided publicId', async () => {
      const publicId = '123e4567-e89b-12d3-a456-426614174000';
      await service.findUserByPublicIdAsync(publicId);
      expect(repository.findOneBy).toHaveBeenCalledWith({ publicId });
    });

    it('should return the result of findOneBy', async () => {
      const publicId = '123e4567-e89b-12d3-a456-426614174000';
      const expectedResult = { id: 1, publicId } as User;
      (repository.findOneBy as jest.Mock).mockResolvedValue(expectedResult);

      const result = await service.findUserByPublicIdAsync(publicId);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('createAsync', () => {
    it('should throw BadRequestException if email or password is not provided', async () => {
      const dto: UserCreateDto = { email: '', password: '' };
      await expect(service.createAsync(dto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should create and save a user with encrypted password', async () => {
      const dto: UserCreateDto = {
        email: 'test@example.com',
        password: 'password123',
      };
      const encryptedPassword = 'encryptedPassword';
      const createdUser = {
        id: 1,
        email: dto.email,
        password: encryptedPassword,
      } as User;

      (cryptService.encryptText as jest.Mock).mockResolvedValue(
        encryptedPassword,
      );
      (repository.create as jest.Mock).mockReturnValue(createdUser);

      await service.createAsync(dto);

      expect(cryptService.encryptText).toHaveBeenCalledWith(dto.password);
      expect(repository.save).toHaveBeenCalledWith(createdUser);
      expect(userSeedService.seed).toHaveBeenCalledWith(createdUser);
    });

    it('should return the created user', async () => {
      const dto: UserCreateDto = {
        email: 'test@example.com',
        password: 'password123',
      };
      const encryptedPassword = 'encryptedPassword';
      const createdUser = {
        id: 1,
        email: dto.email,
        password: encryptedPassword,
      } as User;

      (cryptService.encryptText as jest.Mock).mockResolvedValue(
        encryptedPassword,
      );
      (repository.create as jest.Mock).mockReturnValue(createdUser);

      const result = await service.createAsync(dto);
      expect(result).toEqual(createdUser);
    });
  });

  describe('updatePasswordAsync', () => {
    it('should call findUserByPublicIdAsync and save with the new encrypted password', async () => {
      const newPassword = 'newPassword123';
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const user = { id: 1, publicId: userId } as User;
      const encryptedPassword = 'encryptedNewPassword';

      (cryptService.encryptText as jest.Mock).mockResolvedValue(
        encryptedPassword,
      );

      service.findUserByPublicIdAsync = jest.fn().mockResolvedValue(user);

      await service.updatePasswordAsync(newPassword, userId);

      expect(service.findUserByPublicIdAsync).toHaveBeenCalledWith(userId);
      expect(cryptService.encryptText).toHaveBeenCalledWith(newPassword);
      expect(repository.save).toHaveBeenCalledWith({
        id: user.id,
        password: encryptedPassword,
      });
    });

    it('should return the updated user', async () => {
      const newPassword = 'newPassword123';
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const user = { id: 1, publicId: userId } as User;
      const encryptedPassword = 'encryptedNewPassword';
      const updatedUser = { id: 1, password: encryptedPassword } as User;

      service.findUserByPublicIdAsync = jest.fn().mockResolvedValue(user);

      (cryptService.encryptText as jest.Mock).mockResolvedValue(
        encryptedPassword,
      );
      (repository.save as jest.Mock).mockResolvedValue(updatedUser);

      const result = await service.updatePasswordAsync(newPassword, userId);
      expect(result).toEqual(updatedUser);
    });
  });

  describe('update', () => {
    it('should save the user with the provided dto and return the updated user', async () => {
      const user = { id: 1, email: 'test@example.com' } as User;
      const dto: UpdateUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: new Date().toISOString(),
      };
      const updatedUser = { ...user, ...dto } as User;

      (repository.save as jest.Mock).mockResolvedValue(updatedUser);
      (repository.findOneBy as jest.Mock).mockResolvedValue(updatedUser);

      const result = await service.update(user, dto);

      expect(repository.save).toHaveBeenCalledWith({ ...user, ...dto });
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: user.id });
      expect(result).toEqual(updatedUser);
    });
  });
});
