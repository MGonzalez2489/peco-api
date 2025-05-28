import { Test, TestingModule } from '@nestjs/testing';
import { AccountKpiController } from './account-kpi.controller';
import { AccountsKpiService } from '@accounts/services/accounts-kpi.service';

describe('AccountKpiController', () => {
  let controller: AccountKpiController;
  let service: AccountsKpiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountKpiController],
      providers: [
        {
          provide: AccountsKpiService,
          useValue: {
            getGeneralKPIs: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AccountKpiController>(AccountKpiController);
    service = module.get<AccountsKpiService>(AccountsKpiService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });
});
