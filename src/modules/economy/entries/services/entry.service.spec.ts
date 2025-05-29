import { AccountService } from '@accounts/services/account.service';
import { EntryTypeEnum } from '@catalogs/enums';
import {
  CatAccountTypeService,
  CatEntryStatusService,
  CatEntryTypeService,
} from '@catalogs/services';
import { PaginatedResponseDto } from '@common/dtos/pagination';
import { PaginationOrderEnum } from '@common/enums';
import { User } from '@datasource/entities';
import { Entry } from '@datasource/entities/economy';
import { CreateEntryDto, EntryDto } from '@entries/dtos';
import { SearchEntriesDto } from '@entries/dtos/search.dto';
import { EntryCategoryService } from '@entry-category/services/entry-category.service';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EntryService } from './entry.service';

describe('EntryService', () => {
  let service: EntryService;
  let repository: Repository<Entry>;
  let accountService: AccountService;
  let categoryService: EntryCategoryService;
  let catEntryTypeService: CatEntryTypeService;
  let catEntryStatusService: CatEntryStatusService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EntryService,
        {
          provide: getRepositoryToken(Entry),
          useValue: {
            createQueryBuilder: jest.fn().mockReturnValue({
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
            }),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: AccountService,
          useValue: {
            getAccountByPublicIdAsync: jest.fn(),
            updateAccountBalanceAsync: jest.fn(),
          },
        },
        {
          provide: CatAccountTypeService,
          useValue: {},
        },
        {
          provide: EntryCategoryService,
          useValue: {
            getByPublicIdAsync: jest.fn(),
          },
        },
        {
          provide: CatEntryTypeService,
          useValue: {
            getEntryTypeByPublicIdAsync: jest.fn(),
          },
        },
        {
          provide: CatEntryStatusService,
          useValue: {
            getEntryStatusByValueAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<EntryService>(EntryService);
    repository = module.get<Repository<Entry>>(getRepositoryToken(Entry));
    accountService = module.get<AccountService>(AccountService);
    categoryService = module.get<EntryCategoryService>(EntryCategoryService);
    catEntryTypeService = module.get<CatEntryTypeService>(CatEntryTypeService);
    catEntryStatusService = module.get<CatEntryStatusService>(
      CatEntryStatusService,
    );
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
    expect(accountService).toBeDefined();
    expect(categoryService).toBeDefined();
    expect(catEntryTypeService).toBeDefined();
    expect(catEntryStatusService).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('getEntriesByAccountAsync', () => {
    it('should call SearchByQuery with correct parameters', async () => {
      const searchDto: SearchEntriesDto = {
        accountId: '123',
        categoryId: '456',
        entryTypeId: '789',
        from: new Date('2023-01-01').toString(),
        to: new Date('2023-12-31').toString(),
        orderBy: 'createdAt',
        order: PaginationOrderEnum.ASC,
        page: 1,
        take: 10,
        skip: 0,
        showAll: false,
      };
      const user = { id: 1 } as User;
      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
      };
      (repository.createQueryBuilder as jest.Mock).mockReturnValue(
        mockQueryBuilder,
      );
      const searchByQuerySpy = jest
        .spyOn(service, 'SearchByQuery')
        .mockResolvedValue({
          data: [],
          meta: {
            itemCount: 0,
          },
        } as unknown as PaginatedResponseDto<Entry>);

      await service.getEntriesByAccountAsync(searchDto, user);

      expect(repository.createQueryBuilder).toHaveBeenCalled();
      expect(searchByQuerySpy).toHaveBeenCalled();
    });

    it('should map the response data to EntryDto', async () => {
      const searchDto: SearchEntriesDto = {
        accountId: '123',
        from: new Date('2023-01-01').toString(),
        to: new Date('2023-12-31').toString(),
        orderBy: 'createdAt',
        order: PaginationOrderEnum.ASC,
        page: 1,
        take: 10,
        skip: 0,
        showAll: false,
      };
      const user = { id: 1 } as User;
      const entry = { id: 1, amount: 100 } as Entry;
      jest.spyOn(service, 'SearchByQuery').mockResolvedValue({
        data: [entry],
        meta: {
          itemCount: 1,
        },
      } as PaginatedResponseDto<Entry>);

      const result = await service.getEntriesByAccountAsync(searchDto, user);

      if (result) {
        expect(result.data[0]).toBeInstanceOf(EntryDto);
      }
    });
  });

  describe('createEntryAsync', () => {
    it('should throw BadRequestException if account is not found', async () => {
      const dto: CreateEntryDto = {
        accountId: '123',
        categoryId: '456',
        entryTypeId: '789',
        amount: 100,
        description: 'Test Entry',
      };
      const user = { id: 1 } as User;
      (accountService.getAccountByPublicIdAsync as jest.Mock).mockResolvedValue(
        null,
      );

      await expect(service.createEntryAsync(dto, user)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw UnauthorizedException if user does not own the account', async () => {
      const dto: CreateEntryDto = {
        accountId: '123',
        categoryId: '456',
        entryTypeId: '789',
        amount: 100,
        description: 'Test Entry',
      };
      const user = { id: 1 } as User;
      const account = { id: 1, userId: 2 };
      (accountService.getAccountByPublicIdAsync as jest.Mock).mockResolvedValue(
        account,
      );

      await expect(service.createEntryAsync(dto, user)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should create and save a new entry and update account balance', async () => {
      const dto: CreateEntryDto = {
        accountId: '123',
        categoryId: '456',
        entryTypeId: '789',
        amount: 100,
        description: 'Test Entry',
      };
      const user = { id: 1 } as User;
      const account = { id: 1, userId: 1, balance: 500 };
      const category = { id: 1 };
      const entryType = { id: 1, name: EntryTypeEnum.Income.toString() };
      const entryStatus = { id: 1 };
      const entry = {
        id: 1,
        amount: dto.amount,
        description: dto.description,
        type: entryType,
        account: account,
        category: category,
        status: entryStatus,
      };

      (accountService.getAccountByPublicIdAsync as jest.Mock).mockResolvedValue(
        account,
      );
      (categoryService.getByPublicIdAsync as jest.Mock).mockResolvedValue(
        category,
      );
      (
        catEntryTypeService.getEntryTypeByPublicIdAsync as jest.Mock
      ).mockResolvedValue(entryType);
      (
        catEntryStatusService.getEntryStatusByValueAsync as jest.Mock
      ).mockResolvedValue(entryStatus);
      (repository.create as jest.Mock).mockReturnValue(entry);

      await service.createEntryAsync(dto, user);

      expect(repository.save).toHaveBeenCalledWith(entry);
      expect(accountService.updateAccountBalanceAsync).toHaveBeenCalledWith(
        account.id,
        account.balance + entry.amount,
      );
    });
  });
});
