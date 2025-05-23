import { PageOptionsDto } from '@common/dtos/pagination';
import { Test, TestingModule } from '@nestjs/testing';
import { CatAccountTypeService } from '../services/cat-account-type.service';
import { CatEntryStatusService } from '../services/cat-entry-status.service';
import { CatEntryTypeService } from '../services/cat-entry-type.service';
import { CatalogsController } from './catalogs.controller';

describe('CatalogsController', () => {
  let controller: CatalogsController;
  let catEntryTypeService: CatEntryTypeService;
  let catEntryStatusService: CatEntryStatusService;
  let catAccountTypeService: CatAccountTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CatalogsController],
      providers: [
        {
          provide: CatEntryTypeService,
          useValue: {
            getPaginatedEntryTypesAsync: jest.fn(),
          },
        },
        {
          provide: CatEntryStatusService,
          useValue: {
            getPaginatedEntryStatusAsync: jest.fn(),
          },
        },
        {
          provide: CatAccountTypeService,
          useValue: {
            getPaginatedAccountTypesAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CatalogsController>(CatalogsController);
    catEntryTypeService = module.get<CatEntryTypeService>(CatEntryTypeService);
    catEntryStatusService = module.get<CatEntryStatusService>(
      CatEntryStatusService,
    );
    catAccountTypeService = module.get<CatAccountTypeService>(
      CatAccountTypeService,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getEntryTypes', () => {
    it('should call catEntryTypeService.getPaginatedEntryTypesAsync with paginationDto', async () => {
      const paginationDto: PageOptionsDto = {
        page: 1,
        take: 10,
        hint: null,
        showAll: false,
        skip: 0,
      };

      await controller.getEntryTypes(paginationDto);
      expect(
        catEntryTypeService.getPaginatedEntryTypesAsync,
      ).toHaveBeenCalledWith(paginationDto);
    });

    it('should return the result of catEntryTypeService.getPaginatedEntryTypesAsync', async () => {
      const paginationDto: PageOptionsDto = {
        page: 1,
        take: 10,
        hint: null,
        showAll: false,
        skip: 0,
      };
      const expectedResult = [
        { id: 1, name: 'Type 1' },
        { id: 2, name: 'Type 2' },
      ];
      (
        catEntryTypeService.getPaginatedEntryTypesAsync as jest.Mock
      ).mockResolvedValue(expectedResult);

      const result = await controller.getEntryTypes(paginationDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getAccountTypes', () => {
    it('should call catAccountTypeService.getPaginatedAccountTypesAsync with paginationDto', async () => {
      const paginationDto: PageOptionsDto = {
        page: 1,
        take: 10,
        hint: null,
        showAll: false,
        skip: 0,
      };

      await controller.getAccountTypes(paginationDto);
      expect(
        catAccountTypeService.getPaginatedAccountTypesAsync,
      ).toHaveBeenCalledWith(paginationDto);
    });

    it('should return the result of catAccountTypeService.getPaginatedAccountTypesAsync', async () => {
      const paginationDto: PageOptionsDto = {
        page: 1,
        take: 10,
        hint: null,
        showAll: false,
        skip: 0,
      };
      const expectedResult = [
        { id: 1, name: 'Account 1' },
        { id: 2, name: 'Account 2' },
      ];
      (
        catAccountTypeService.getPaginatedAccountTypesAsync as jest.Mock
      ).mockResolvedValue(expectedResult);

      const result = await controller.getAccountTypes(paginationDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getEntryStatus', () => {
    it('should call catEntryStatusService.getPaginatedEntryStatusAsync with paginationDto', async () => {
      const paginationDto: PageOptionsDto = {
        page: 1,
        take: 10,
        hint: null,
        showAll: false,
        skip: 0,
      };

      await controller.getEntryStatus(paginationDto);
      expect(
        catEntryStatusService.getPaginatedEntryStatusAsync,
      ).toHaveBeenCalledWith(paginationDto);
    });

    it('should return the result of catEntryStatusService.getPaginatedEntryStatusAsync', async () => {
      const paginationDto: PageOptionsDto = {
        page: 1,
        take: 10,
        hint: null,
        showAll: false,
        skip: 0,
      };
      const expectedResult = [
        { id: 1, name: 'Status 1' },
        { id: 2, name: 'Status 2' },
      ];
      (
        catEntryStatusService.getPaginatedEntryStatusAsync as jest.Mock
      ).mockResolvedValue(expectedResult);

      const result = await controller.getEntryStatus(paginationDto);
      expect(result).toEqual(expectedResult);
    });
  });
});
