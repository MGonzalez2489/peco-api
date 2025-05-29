import {
  PageMetaDto,
  PageOptionsDto,
  PaginatedResponseDto,
} from '@common/dtos/pagination';
import { EntryType } from '@datasource/entities/catalogs';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CatEntryTypeService } from './cat-entry-type.service';

describe('CatEntryTypeService', () => {
  let service: CatEntryTypeService;
  let repository: Repository<EntryType>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CatEntryTypeService,
        {
          provide: getRepositoryToken(EntryType),
          useValue: {
            find: jest.fn(),
            findOneBy: jest.fn(),
            createQueryBuilder: jest.fn().mockReturnValue({}),
          },
        },
      ],
    }).compile();

    service = module.get<CatEntryTypeService>(CatEntryTypeService);
    repository = module.get<Repository<EntryType>>(
      getRepositoryToken(EntryType),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('getPaginatedEntryTypesAsync', () => {
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
        .spyOn(service, 'SearchByQuery')
        .mockResolvedValue(response);
      await service.getPaginatedEntryTypesAsync(paginationDto);

      expect(searchSpy).toHaveBeenCalledWith({}, paginationDto);
    });

    it('should return the result of Search', async () => {
      const paginationDto: PageOptionsDto = {
        page: 1,
        take: 10,
        showAll: false,
        skip: 0,
      };
      const expectedResult = [
        { id: 1, name: 'Type 1' },
        { id: 2, name: 'Type 2' },
      ] as EntryType[];

      const response = new PaginatedResponseDto(
        expectedResult,
        new PageMetaDto({
          pageOptionsDto: paginationDto,
          itemCount: expectedResult.length,
        }),
      );

      jest.spyOn(service, 'SearchByQuery').mockResolvedValue(response);
      const result = await service.getPaginatedEntryTypesAsync(paginationDto);

      expect(result).toEqual(response);
    });
  });

  describe('getEntryTypeByPublicIdAsync', () => {
    it('should call findOneBy with the provided publicId', async () => {
      const publicId = '123e4567-e89b-12d3-a456-426614174000';

      await service.getEntryTypeByPublicIdAsync(publicId);

      expect(repository.findOneBy).toHaveBeenCalledWith({ publicId });
    });

    it('should return the result of findOneBy', async () => {
      const publicId = '123e4567-e89b-12d3-a456-426614174000';
      const expectedResult = { id: 1, name: 'Type 1', publicId } as EntryType;

      (repository.findOneBy as jest.Mock).mockResolvedValue(expectedResult);
      const result = await service.getEntryTypeByPublicIdAsync(publicId);

      expect(result).toEqual(expectedResult);
    });
  });
});
