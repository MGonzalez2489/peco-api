import { AccountTypeEnum } from '@catalogs/enums';
import { CatAccountTypeService } from '@catalogs/services';
import { PageOptionsDto, PaginatedResponseDto } from '@common/dtos/pagination';
import { User } from '@datasource/entities';
import { Account } from '@datasource/entities/economy';
import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAccountDto } from '../dto';
import * as AccountConstants from './../constants';
import { AccountService } from './account.service';
import { PaginationOrderEnum } from '@common/enums';

describe('AccountService', () => {
  let service: AccountService;
  let repository: Repository<Account>;
  let catAccountTypeService: CatAccountTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountService,
        {
          provide: getRepositoryToken(Account),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOneBy: jest.fn(),
            createQueryBuilder: jest.fn().mockReturnValue({
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
            }),
            softDelete: jest.fn(),
          },
        },
        {
          provide: CatAccountTypeService,
          useValue: {
            getAccountTypeByValueAsync: jest.fn(),
            getAccountTypeByPublicIdAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AccountService>(AccountService);
    repository = module.get<Repository<Account>>(getRepositoryToken(Account));
    catAccountTypeService = module.get<CatAccountTypeService>(
      CatAccountTypeService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
    expect(catAccountTypeService).toBeDefined();
  });

  describe('createRootAccountAsync', () => {
    it('should throw BadRequestException if user is not provided', async () => {
      await expect(service.createRootAccountAsync(null)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should create and save a root account', async () => {
      const user = { id: 1 } as User;
      const accountType = { id: 123 };
      (
        catAccountTypeService.getAccountTypeByValueAsync as jest.Mock
      ).mockResolvedValue(accountType);
      const createdAccount = {
        id: 1,
        name: AccountConstants.DEFAULT_NAME,
        user,
        balance: 0,
        initialBalance: 0,
        isDefault: true,
        isRoot: true,
        typeId: accountType.id,
      } as Account;
      (repository.create as jest.Mock).mockReturnValue(createdAccount);

      await service.createRootAccountAsync(user);

      expect(
        catAccountTypeService.getAccountTypeByValueAsync,
      ).toHaveBeenCalledWith(AccountTypeEnum.Cash);
      expect(repository.save).toHaveBeenCalledWith(createdAccount);
    });
  });

  describe('createAccountAsync', () => {
    it('should create and save a new account', async () => {
      const dto: CreateAccountDto = {
        name: 'Test Account',
        balance: 100,
        isDefault: false,
        accountTypeId: '123',
      };
      const user = { id: 1 } as User;
      const accountType = { id: 123 };
      (
        catAccountTypeService.getAccountTypeByPublicIdAsync as jest.Mock
      ).mockResolvedValue(accountType);
      const createdAccount = {
        id: 1,
        name: dto.name,
        user,
        publicId: '123412341234',
        balance: dto.balance,
        initialBalance: dto.balance,
        isDefault: dto.isDefault,
        typeId: accountType.id,
        type: accountType,
      } as Account;
      repository.create = jest.fn().mockReturnValue(createdAccount);
      repository.save = jest.fn().mockReturnValue(createdAccount);

      const result = await service.createAccountAsync(dto, user);

      expect(
        catAccountTypeService.getAccountTypeByPublicIdAsync,
      ).toHaveBeenCalledWith(dto.accountTypeId);
      expect(repository.save).toHaveBeenCalledWith(createdAccount);
      expect(result).toEqual(createdAccount);
    });
  });

  describe('getAccountByPublicIdAsync', () => {
    it('should throw BadRequestException if publicId is not provided', async () => {
      await expect(service.getAccountByPublicIdAsync(null)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should call findOneBy with correct parameters', async () => {
      const publicId = '123';
      const user = { id: 1 } as User;
      await service.getAccountByPublicIdAsync(publicId, user);
      expect(repository.findOneBy).toHaveBeenCalledWith({
        publicId,
        userId: user.id,
      });
    });
  });

  describe('getAccountsByUserAsync', () => {
    it('should call SearchByQuery with correct parameters', async () => {
      const pageOptionsDto: PageOptionsDto = {
        page: 1,
        take: 10,
        hint: 'Test',
        orderBy: 'name',
        showAll: false,
        skip: 0,
        order: PaginationOrderEnum.ASC,
      };
      const user = { id: 1 } as User;
      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
      };
      (repository.createQueryBuilder as jest.Mock).mockReturnValue(
        mockQueryBuilder,
      );
      const searchByQuerySpy = jest
        .spyOn(service, 'SearchByQuery')
        .mockResolvedValue({} as PaginatedResponseDto<Account>);

      await service.getAccountsByUserAsync(pageOptionsDto, user);

      expect(repository.createQueryBuilder).toHaveBeenCalled();
      expect(searchByQuerySpy).toHaveBeenCalled();
    });
  });

  describe('updateAccountBalanceAsync', () => {
    it('should call repository.save with correct parameters', async () => {
      const id = 1;
      const newBalance = 200;
      await service.updateAccountBalanceAsync(id, newBalance);
      expect(repository.save).toHaveBeenCalledWith({ id, balance: newBalance });
    });
  });

  describe('updateAccountAsync', () => {
    it('should throw BadRequestException if account is not found', async () => {
      const dto: CreateAccountDto = {
        name: 'Test Account',
        balance: 100,
        isDefault: false,
        accountTypeId: '123',
      };
      const accountId = '123';
      const user = { id: 1 } as User;
      service.getAccountByPublicIdAsync = jest.fn().mockResolvedValue(null);
      await expect(
        service.updateAccountAsync(dto, accountId, user),
      ).rejects.toThrow(BadRequestException);
    });

    it('should call repository.save with correct parameters', async () => {
      const dto: CreateAccountDto = {
        name: 'Test Account',
        balance: 100,
        isDefault: false,
        accountTypeId: '123',
      };
      const accountId = '123';
      const user = { id: 1 } as User;
      const account = { id: 1, publicId: accountId } as Account;
      const accountType = { id: 123 };
      service.getAccountByPublicIdAsync = jest.fn().mockResolvedValue(account);

      (
        catAccountTypeService.getAccountTypeByPublicIdAsync as jest.Mock
      ).mockResolvedValue(accountType);

      await service.updateAccountAsync(dto, accountId, user);

      expect(repository.save).toHaveBeenCalled();
    });
  });

  describe('deleteAccount', () => {
    it('should throw BadRequestException if account is default', async () => {
      const publicId = '123';
      const user = { id: 1 } as User;
      const account = { id: 1, isDefault: true } as Account;
      service.getAccountByPublicIdAsync = jest.fn().mockResolvedValue(account);
      await expect(service.deleteAccount(publicId, user)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should call repository.softDelete with correct parameters', async () => {
      const publicId = '123';
      const user = { id: 1 } as User;
      const account = { id: 1, isDefault: false } as Account;
      service.getAccountByPublicIdAsync = jest.fn().mockResolvedValue(account);

      await service.deleteAccount(publicId, user);

      expect(repository.softDelete).toHaveBeenCalledWith({
        publicId,
        userId: user.id,
      });
    });
  });
});
