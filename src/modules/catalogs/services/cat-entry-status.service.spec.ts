import {
  PageMetaDto,
  PageOptionsDto,
  PaginatedResponseDto,
} from '@common/dtos/pagination';
import { EntryStatus } from '@datasource/entities/catalogs';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EntryStatusEnum } from '../enums';
import { CatEntryStatusService } from './cat-entry-status.service';

describe('CatEntryStatusService', () => {
  let service: CatEntryStatusService;
  let repository: Repository<EntryStatus>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CatEntryStatusService,
        {
          provide: getRepositoryToken(EntryStatus),
          useValue: {
            find: jest.fn(),
            findOneBy: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CatEntryStatusService>(CatEntryStatusService);
    repository = module.get<Repository<EntryStatus>>(
      getRepositoryToken(EntryStatus),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('getPaginatedEntryStatusAsync', () => {
    it('should call Search with paginationDto and empty where clause', async () => {
      const paginationDto: PageOptionsDto = {
        page: 1,
        take: 10,
        showAll: false,
        skip: 0,
      };

      const response = new PaginatedResponseDto(
        [],
        new PageMetaDto({ pageOptionsDto: paginationDto, itemCount: 10 }),
      );

      const searchSpy = jest
        .spyOn(service, 'Search')
        .mockResolvedValue(response);
      await service.getPaginatedEntryStatusAsync(paginationDto);

      expect(searchSpy).toHaveBeenCalledWith(paginationDto, {});
    });

    it('should return the result of Search', async () => {
      const paginationDto: PageOptionsDto = {
        page: 1,
        take: 10,
        showAll: false,
        skip: 0,
      };
      const expectedResult = [
        { id: 1, name: 'Status 1' },
        { id: 2, name: 'Status 2' },
      ] as EntryStatus[];

      const response = new PaginatedResponseDto(
        expectedResult,
        new PageMetaDto({
          pageOptionsDto: paginationDto,
          itemCount: expectedResult.length,
        }),
      );

      jest.spyOn(service, 'Search').mockResolvedValue(response);
      const result = await service.getPaginatedEntryStatusAsync(paginationDto);

      expect(result).toEqual(response);
    });
  });

  describe('getEntryStatusAsync', () => {
    it('should call find on the repository', async () => {
      await service.getEntryStatusAsync();
      expect(repository.find).toHaveBeenCalled();
    });

    it('should return the result of find', async () => {
      const expectedResult = [
        { id: 1, name: 'Status 1' },
        { id: 2, name: 'Status 2' },
      ] as EntryStatus[];
      (repository.find as jest.Mock).mockResolvedValue(expectedResult);

      const result = await service.getEntryStatusAsync();
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getEntryStatusByValueAsync', () => {
    it('should call findOneBy with the provided value as name', async () => {
      const value = EntryStatusEnum.Planned;
      await service.getEntryStatusByValueAsync(value);
      expect(repository.findOneBy).toHaveBeenCalledWith({
        name: value.toString(),
      });
    });

    it('should return the result of findOneBy', async () => {
      const value = EntryStatusEnum.Deleted;
      const expectedResult = { id: 1, name: value.toString() } as EntryStatus;
      (repository.findOneBy as jest.Mock).mockResolvedValue(expectedResult);

      const result = await service.getEntryStatusByValueAsync(value);
      expect(result).toEqual(expectedResult);
    });
  });
});
