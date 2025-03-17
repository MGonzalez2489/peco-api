import { Test, TestingModule } from '@nestjs/testing';
import { PlannedEntriesController } from './planned-entries.controller';

describe('PlannedEntriesController', () => {
  let controller: PlannedEntriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlannedEntriesController],
    }).compile();

    controller = module.get<PlannedEntriesController>(PlannedEntriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
