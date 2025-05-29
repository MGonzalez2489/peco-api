import { AccountService } from '@accounts/services/account.service';
import { User } from '@datasource/entities';
import { EntryCategoryDto } from '@entry-category/dto/entry-category.dto';
import { EntryCategoryService } from '@entry-category/services/entry-category.service';
import { Test, TestingModule } from '@nestjs/testing';
import { CatSeedData } from '@users/seed/categories.seed';
import { UserSeedService } from './user-seed.service';

describe('UserSeedService', () => {
  let service: UserSeedService;
  let accountService: AccountService;
  let entryCategoryService: EntryCategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserSeedService,
        {
          provide: AccountService,
          useValue: {
            createRootAccountAsync: jest.fn(),
          },
        },
        {
          provide: EntryCategoryService,
          useValue: {
            createCategory: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserSeedService>(UserSeedService);
    accountService = module.get<AccountService>(AccountService);
    entryCategoryService =
      module.get<EntryCategoryService>(EntryCategoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(accountService).toBeDefined();
    expect(entryCategoryService).toBeDefined();
  });

  describe('seed', () => {
    it('should call createRootAccountAsync and seedCategories', async () => {
      const user = { id: 1 } as User;
      await service.seed(user);

      expect(accountService.createRootAccountAsync).toHaveBeenCalledWith(user);
      expect(entryCategoryService.createCategory).toHaveBeenCalled();
    });

    it('should throw error if createRootAccountAsync throws error', async () => {
      const user = { id: 1 } as User;
      const error = new Error('Account creation failed');
      (accountService.createRootAccountAsync as jest.Mock).mockRejectedValue(
        error,
      );

      await expect(service.seed(user)).rejects.toThrow(error);
    });

    it('should throw error if seedCategories throws error', async () => {
      const user = { id: 1 } as User;
      const error = new Error('Category seeding failed');
      (entryCategoryService.createCategory as jest.Mock).mockRejectedValue(
        error,
      );

      await expect(service.seed(user)).rejects.toThrow(error);
    });
  });

  describe('seedCategories', () => {
    it('should call createCategory for each category in source', async () => {
      const user = { id: 1 } as User;
      await service.seed(user);

      let totalLength = 0;
      for (let i = 0; i < CatSeedData.length; i++) {
        totalLength++;
        if (CatSeedData[i].subCategories) {
          totalLength = totalLength + CatSeedData[i].subCategories.length;
        }
      }

      expect(entryCategoryService.createCategory).toHaveBeenCalledTimes(
        totalLength,
      );
    });

    it('should call createCategory with correct parameters', async () => {
      const user = { id: 1 } as User;
      await service.seed(user);

      expect(entryCategoryService.createCategory).toHaveBeenCalledWith(
        { name: CatSeedData[0].name, parentId: undefined },
        user,
        true,
      );
    });

    it('should call seedCategories recursively for subcategories', async () => {
      const user = { id: 1 } as User;
      const categoryMock = { publicId: 'test-public-id' } as EntryCategoryDto;
      (entryCategoryService.createCategory as jest.Mock).mockResolvedValue(
        categoryMock,
      );

      await service.seed(user);

      expect(entryCategoryService.createCategory).toHaveBeenCalledWith(
        {
          name: CatSeedData[0].subCategories[0].name,
          parentId: categoryMock.publicId,
        },
        user,
        true,
      );
    });
  });
});
