import {
  PageMetaDto,
  PageOptionsDto,
  PaginatedResponseDto,
} from '@common/dtos/pagination';
import { AccountType } from '@datasource/entities/catalogs';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountTypeEnum } from '../enums';
import { CatAccountTypeService } from './cat-account-type.service';

describe('CatAccountTypeService', () => {
  let service: CatAccountTypeService;
  let repository: Repository<AccountType>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CatAccountTypeService,
        {
          provide: getRepositoryToken(AccountType),
          useValue: {
            find: jest.fn(),
            findOneBy: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CatAccountTypeService>(CatAccountTypeService);
    repository = module.get<Repository<AccountType>>(
      getRepositoryToken(AccountType),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('getPaginatedAccountTypesAsync', () => {
    it('should call Search with paginationDto and empty where clause', async () => {
      const paginationDto: PageOptionsDto = {
        page: 1,
        take: 10,
        hint: undefined,
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
      await service.getPaginatedAccountTypesAsync(paginationDto);

      expect(searchSpy).toHaveBeenCalledWith(paginationDto, {});
    });

    it('should return the result of Search', async () => {
      const paginationDto: PageOptionsDto = {
        page: 1,
        take: 10,
        hint: undefined,
        showAll: false,
        skip: 0,
      };
      const expectedResult = [
        { id: 1, name: 'Type 1' },
        { id: 2, name: 'Type 2' },
      ] as AccountType[];

      const response = new PaginatedResponseDto(
        expectedResult,
        new PageMetaDto({ pageOptionsDto: paginationDto, itemCount: 10 }),
      );

      jest.spyOn(service, 'SearchByQuery').mockResolvedValue(response);
      const result = await service.getPaginatedAccountTypesAsync(paginationDto);

      expect(result).toEqual(response);
    });
  });

  describe('getAccountTypesAsync', () => {
    it('should call find on the repository', async () => {
      await service.getAccountTypesAsync();
      expect(repository.find).toHaveBeenCalled();
    });

    it('should return the result of find', async () => {
      const expectedResult = [
        { id: 1, name: 'Type 1' },
        { id: 2, name: 'Type 2' },
      ] as AccountType[];
      (repository.find as jest.Mock).mockResolvedValue(expectedResult);

      const result = await service.getAccountTypesAsync();
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getAccountTypeByValueAsync', () => {
    it('should call findOneBy with the provided value as name', async () => {
      const value = AccountTypeEnum.Savings;
      await service.getAccountTypeByValueAsync(value);
      expect(repository.findOneBy).toHaveBeenCalledWith({
        name: value.toString(),
      });
    });

    it('should return the result of findOneBy', async () => {
      const value = AccountTypeEnum.Cash;
      const expectedResult = { id: 1, name: value.toString() } as AccountType;
      (repository.findOneBy as jest.Mock).mockResolvedValue(expectedResult);

      const result = await service.getAccountTypeByValueAsync(value);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getAccountTypeByPublicIdAsync', () => {
    it('should call findOneBy with the provided publicId', async () => {
      const publicId = '123e4567-e89b-12d3-a456-426614174000';
      await service.getAccountTypeByPublicIdAsync(publicId);
      expect(repository.findOneBy).toHaveBeenCalledWith({ publicId });
    });

    it('should return the result of findOneBy', async () => {
      const publicId = '123e4567-e89b-12d3-a456-426614174000';
      const expectedResult = { id: 1, publicId } as AccountType;
      (repository.findOneBy as jest.Mock).mockResolvedValue(expectedResult);

      const result = await service.getAccountTypeByPublicIdAsync(publicId);
      expect(result).toEqual(expectedResult);
    });
  });
});
