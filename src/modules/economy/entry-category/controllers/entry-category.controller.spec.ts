import { Test, TestingModule } from '@nestjs/testing';
import { EntryCategoryController } from './entry-category.controller';
import { EntryCategoryService } from '../services/entry-category.service';
import { User } from '@datasource/entities';
import {
  EntryCategoryCreateDto,
  EntryCategoryUpdateDto,
} from '../dto/entry-category.dto';
import { PageOptionsDto } from '@common/dtos/pagination';
import { EntryCategory } from '@datasource/entities/economy';
import { ResponseDto } from '@common/dtos/responses';
import { PaginationOrderEnum } from '@common/enums';

describe('EntryCategoryController', () => {
  let controller: EntryCategoryController;
  let entryCategoryService: EntryCategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EntryCategoryController],
      providers: [
        {
          provide: EntryCategoryService,
          useValue: {
            getAllAsync: jest.fn(),
            createCategory: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<EntryCategoryController>(EntryCategoryController);
    entryCategoryService =
      module.get<EntryCategoryService>(EntryCategoryService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(entryCategoryService).toBeDefined();
  });

  describe('getCategories', () => {
    it('should call entryCategoryService.getAllAsync with paginationDto and user', async () => {
      const paginationDto: PageOptionsDto = {
        page: 1,
        take: 10,
        orderBy: 'name',
        order: PaginationOrderEnum.ASC,
        showAll: true,
        skip: 0,
      };
      const user = { id: 1 } as User;
      await controller.getCategories(paginationDto, user);
      expect(entryCategoryService.getAllAsync).toHaveBeenCalledWith(
        user,
        paginationDto,
      );
    });

    it('should return the result of entryCategoryService.getAllAsync', async () => {
      const paginationDto: PageOptionsDto = {
        page: 1,
        take: 10,
        order: PaginationOrderEnum.ASC,
        showAll: true,
        skip: 0,
      };
      const user = { id: 1 } as User;
      const expectedResult = { data: [], total: 0 };
      (entryCategoryService.getAllAsync as jest.Mock).mockResolvedValue(
        expectedResult,
      );
      const result = await controller.getCategories(paginationDto, user);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('create', () => {
    it('should call entryCategoryService.createCategory with dto, user, and isDefault=false', async () => {
      const dto: EntryCategoryCreateDto = {
        name: 'Test Category',
        parentId: '456',
      };
      const user = { id: 1 } as User;
      await controller.create(dto, user);
      expect(entryCategoryService.createCategory).toHaveBeenCalledWith(
        dto,
        user,
        false,
      );
    });

    it('should return a ResponseDto with the result of entryCategoryService.createCategory', async () => {
      const dto: EntryCategoryCreateDto = {
        name: 'Test Category',
        parentId: '456',
      };
      const user = { id: 1 } as User;
      const expectedResult = { id: 1 } as EntryCategory;
      (entryCategoryService.createCategory as jest.Mock).mockResolvedValue(
        expectedResult,
      );
      const result = await controller.create(dto, user);
      expect(result).toEqual({
        statusCode: 200,
        isSuccess: true,
        data: expectedResult,
      } as ResponseDto<EntryCategory>);
    });
  });

  describe('update', () => {
    it('should call entryCategoryService.update with dto and categoryId', async () => {
      const dto: EntryCategoryUpdateDto = {
        name: 'Updated Category',
        isVisible: true,
      };
      const categoryId = '123';
      await controller.update(dto, categoryId);
      expect(entryCategoryService.update).toHaveBeenCalledWith(dto, categoryId);
    });

    it('should return a ResponseDto with the result of entryCategoryService.update', async () => {
      const dto: EntryCategoryUpdateDto = {
        name: 'Updated Category',
        isVisible: true,
      };
      const categoryId = '123';
      const expectedResult = { id: 1 } as EntryCategory;
      (entryCategoryService.update as jest.Mock).mockResolvedValue(
        expectedResult,
      );
      const result = await controller.update(dto, categoryId);
      expect(result).toEqual({
        statusCode: 200,
        isSuccess: true,
        data: expectedResult,
      } as ResponseDto<EntryCategory>);
    });
  });
});
