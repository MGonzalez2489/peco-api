import { Test, TestingModule } from '@nestjs/testing';
import { EntryController } from './entry.controller';
import { EntryService } from '../services/entry.service';
import { User } from '@datasource/entities';
import { CreateEntryDto } from '../dtos';
import { SearchEntriesDto } from '../dtos/search.dto';
import { Entry } from '@datasource/entities/economy';
import { ResponseDto } from '@common/dtos/responses';
import { PaginatedResponseDto } from '@common/dtos/pagination';
import { PaginationOrderEnum } from '@common/enums';

describe('EntryController', () => {
  let controller: EntryController;
  let entryService: EntryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EntryController],
      providers: [
        {
          provide: EntryService,
          useValue: {
            createEntryAsync: jest.fn(),
            getEntriesByAccountAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<EntryController>(EntryController);
    entryService = module.get<EntryService>(EntryService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(entryService).toBeDefined();
  });

  describe('createEntry', () => {
    it('should call entryService.createEntryAsync with createDto and user', async () => {
      const createDto: CreateEntryDto = {
        accountId: '123',
        categoryId: '456',
        entryTypeId: '789',
        amount: 100,
        description: 'Test Entry',
      };
      const user = { id: 1 } as User;
      await controller.createEntry(createDto, user);
      expect(entryService.createEntryAsync).toHaveBeenCalledWith(
        createDto,
        user,
      );
    });

    it('should return a ResponseDto with the result of entryService.createEntryAsync', async () => {
      const createDto: CreateEntryDto = {
        accountId: '123',
        categoryId: '456',
        entryTypeId: '789',
        amount: 100,
        description: 'Test Entry',
      };
      const user = { id: 1 } as User;
      const expectedResult = { id: 1 } as Entry;
      (entryService.createEntryAsync as jest.Mock).mockResolvedValue(
        expectedResult,
      );
      const result = await controller.createEntry(createDto, user);
      expect(result).toEqual({
        statusCode: 200,
        isSuccess: true,
        data: expectedResult,
      } as ResponseDto<Entry>);
    });
  });

  describe('getEntries', () => {
    it('should call entryService.getEntriesByAccountAsync with paginationDto and user', async () => {
      const paginationDto: SearchEntriesDto = {
        accountId: '123',
        fromDate: new Date('2023-01-01').toString(),
        toDate: new Date('2023-12-31').toString(),
        orderBy: 'createdAt',
        order: PaginationOrderEnum.ASC,
        page: 1,
        take: 10,
        showAll: false,
        skip: 0,
      };
      const user = { id: 1 } as User;
      await controller.getEntries(paginationDto, user);
      expect(entryService.getEntriesByAccountAsync).toHaveBeenCalledWith(
        paginationDto,
        user,
      );
    });

    it('should return the result of entryService.getEntriesByAccountAsync', async () => {
      const paginationDto: SearchEntriesDto = {
        accountId: '123',
        fromDate: new Date('2023-01-01').toString(),
        toDate: new Date('2023-12-31').toString(),
        orderBy: 'createdAt',
        order: PaginationOrderEnum.ASC,
        page: 1,
        take: 10,
        showAll: false,
        skip: 0,
      };
      const user = { id: 1 } as User;
      const expectedResult = {} as PaginatedResponseDto<Entry>;
      (entryService.getEntriesByAccountAsync as jest.Mock).mockResolvedValue(
        expectedResult,
      );
      const result = await controller.getEntries(paginationDto, user);
      expect(result).toEqual(expectedResult);
    });
  });
});
