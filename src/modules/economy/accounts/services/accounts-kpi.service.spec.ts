import { CatEntryStatusService, CatEntryTypeService } from '@catalogs/services';
import { Account, Entry } from '@datasource/entities/economy';
import { EntriesKpiService } from '@entries/services';
import { EntryCategoryService } from '@entry-category/services/entry-category.service';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('AccountsKpiService', () => {
  let accRepository: Repository<Account>;
  let service: EntriesKpiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
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
        EntriesKpiService,
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

    accRepository = module.get<Repository<Account>>(
      getRepositoryToken(Account),
    );
    service = module.get<EntriesKpiService>(EntriesKpiService);
  });

  it('should be defined', () => {
    expect(accRepository).toBeDefined();
    expect(service).toBeDefined();
  });
});
