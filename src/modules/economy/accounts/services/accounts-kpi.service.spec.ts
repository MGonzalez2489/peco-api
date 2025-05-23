import { Test, TestingModule } from '@nestjs/testing';
import { AccountsKpiService } from './accounts-kpi.service';

describe('AccountsKpiService', () => {
  let service: AccountsKpiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccountsKpiService],
    }).compile();

    service = module.get<AccountsKpiService>(AccountsKpiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
