import { Test, TestingModule } from '@nestjs/testing';
import { PlannedEntriesService } from './planned-entries.service';

describe('PlannedEntriesService', () => {
  let service: PlannedEntriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlannedEntriesService],
    }).compile();

    service = module.get<PlannedEntriesService>(PlannedEntriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
