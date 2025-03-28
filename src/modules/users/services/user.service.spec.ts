import { AccountsModule } from '@accounts/accounts.module';
import { CatalogsModule } from '@catalogs/catalogs.module';
import { CommonModule } from '@common/common.module';
import { EntryCategoryModule } from '@entry-category/entry-category.module';
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        AccountsModule,
        CommonModule,
        CatalogsModule,
        EntryCategoryModule,
      ],
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
