import { Test, TestingModule } from '@nestjs/testing';
import { AccountKpiController } from './account-kpi.controller';

describe('AccountKpiController', () => {
  let controller: AccountKpiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountKpiController],
    }).compile();

    controller = module.get<AccountKpiController>(AccountKpiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
