import { PageOptionsDto, PaginatedResponseDto } from '@common/dtos/pagination';
import { PaginationOrderEnum } from '@common/enums';
import { User } from '@datasource/entities';
import { EntryCategory } from '@datasource/entities/economy';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  EntryCategoryCreateDto,
  EntryCategoryDto,
  EntryCategoryUpdateDto,
} from '../dto/entry-category.dto';
import { EntryCategoryService } from './entry-category.service';

describe('EntryCategoryService', () => {
  let service: EntryCategoryService;
  let repository: Repository<EntryCategory>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EntryCategoryService,
        {
          provide: getRepositoryToken(EntryCategory),
          useValue: {
            createQueryBuilder: jest.fn().mockReturnValue({
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
            }),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            findOneBy: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<EntryCategoryService>(EntryCategoryService);
    repository = module.get<Repository<EntryCategory>>(
      getRepositoryToken(EntryCategory),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('getAllAsync', () => {
    it('should call SearchByQuery with correct parameters', async () => {
      const user = { id: 1 } as User;
      const pageOptions: PageOptionsDto = {
        page: 1,
        take: 10,
        orderBy: 'name',
        order: PaginationOrderEnum.ASC,
        showAll: false,
        skip: 0,
      };
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
        .mockResolvedValue({
          data: [],
          meta: {
            itemCount: 0,
            page: 1,
            take: 10,
            pageCount: 10,
            hasNextPage: true,
            hasPreviousPage: true,
          },
        } as PaginatedResponseDto<EntryCategory>);

      await service.getAllAsync(user, pageOptions);

      expect(repository.createQueryBuilder).toHaveBeenCalled();
      expect(searchByQuerySpy).toHaveBeenCalled();
    });

    it('should filter and map the response data to EntryCategoryDto', async () => {
      const user = { id: 1 } as User;
      const pageOptions: PageOptionsDto = {
        page: 1,
        take: 10,
        order: PaginationOrderEnum.ASC,
        showAll: false,
        skip: 0,
      };
      const categories = [
        { id: 1, name: 'Category 1', parentId: null },
        { id: 2, name: 'Category 2', parentId: 1 },
        { id: 3, name: 'Category 3', parentId: null },
      ] as EntryCategory[];
      jest.spyOn(service, 'SearchByQuery').mockResolvedValue({
        data: categories,
        meta: {
          itemCount: 3,
        },
      } as PaginatedResponseDto<EntryCategory>);

      const result = await service.getAllAsync(user, pageOptions);

      expect(result.data).toHaveLength(2);
      expect(result.data[0]).toBeInstanceOf(EntryCategoryDto);
      expect(result.data[0].subCategories).toHaveLength(1);
    });
  });

  describe('getByPublicIdAsync', () => {
    it('should call repository.findOne with correct parameters', async () => {
      const catId = '123';
      const user = { id: 1 } as User;

      await service.getByPublicIdAsync(catId, user);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { publicId: catId, userId: user.id },
        relations: ['parent'],
      });
    });
  });

  describe('createCategory', () => {
    it('should create and save a new category', async () => {
      const categoryDto: EntryCategoryCreateDto = {
        name: 'Test Category',
        parentId: '456',
        icon: '',
        color: '',
        forTypeId: 1,
      };
      const user = { id: 1 } as User;
      const parentCategory = { id: 2 } as EntryCategory;
      const newCategory = {
        id: 3,
        publicId: '789',
        name: categoryDto.name,
        userId: user.id,
        parentId: parentCategory.id,
        isVisible: true,
        isParent: false,
        isDefault: true,
        subCategories: [],
        user,
        parent: parentCategory,
        entries: [],
        createdAt: '',
        deletedAt: '',
        updatedAt: '',
        icon: '',
        color: '',
        forTypeId: 1,
        forType: {
          id: 1,
          name: '',
          publicId: '',
          displayName: '',
          color: '',
          createdAt: '',
          deletedAt: '',
          updatedAt: '',
        },
      };
      const expectedResult = new EntryCategoryDto(newCategory);

      service.getByPublicIdAsync = jest.fn().mockResolvedValue(parentCategory);
      (repository.create as jest.Mock).mockReturnValue(newCategory);
      (repository.save as jest.Mock).mockResolvedValue(newCategory);
      (service.getByPublicIdAsync as jest.Mock).mockResolvedValue(newCategory);

      const result = await service.createCategory(categoryDto, user, false);

      expect(repository.save).toHaveBeenCalledWith(newCategory);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('update', () => {
    it('should update a category', async () => {
      const dto: EntryCategoryUpdateDto = {
        name: 'Updated Category',
        isVisible: true,
      };
      const categoryId = '123';
      const cat = { id: 1, publicId: categoryId } as EntryCategory;
      const updatedCat = {
        id: 1,
        publicId: categoryId,
        name: dto.name,
        isVisible: dto.isVisible,
      } as EntryCategory;
      const expectedResult = new EntryCategoryDto(updatedCat);

      (repository.findOneBy as jest.Mock).mockResolvedValue(cat);
      (repository.save as jest.Mock).mockResolvedValue(updatedCat);
      (repository.findOneBy as jest.Mock).mockResolvedValue(updatedCat);

      const result = await service.update(dto, categoryId);

      expect(repository.save).toHaveBeenCalledWith({
        id: cat.id,
        name: dto.name,
        isVisible: dto.isVisible,
      });
      expect(result).toEqual(expectedResult);
    });
  });
});
