import { CatEntryStatusService, CatEntryTypeService } from '@catalogs/services';
import { Entry } from '@datasource/entities/economy';
import { EntryCategoryService } from '@entry-category/services/entry-category.service';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EntriesKpiService } from './entries-kpi.service';

describe('EntriesKpiService', () => {
  let repository: Repository<Entry>;
  let service: EntriesKpiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(Entry),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            findOneBy: jest.fn(),
            createQueryBuilder: jest.fn().mockReturnValue({
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
            }),
            softDelete: jest.fn(),
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

        EntriesKpiService,
      ],
    }).compile();

    repository = module.get<Repository<Entry>>(getRepositoryToken(Entry));
    service = module.get<EntriesKpiService>(EntriesKpiService);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
    expect(service).toBeDefined();
  });
});
