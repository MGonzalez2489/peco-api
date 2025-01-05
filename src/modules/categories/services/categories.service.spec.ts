import { Test, TestingModule } from '@nestjs/testing';
import { UserCategoriesService } from './categories.service';

describe('UserCategoriesService', () => {
  let service: UserCategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserCategoriesService],
    }).compile();

    service = module.get<UserCategoriesService>(UserCategoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
