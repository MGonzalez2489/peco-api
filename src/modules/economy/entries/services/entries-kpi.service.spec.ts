import { Test, TestingModule } from '@nestjs/testing';
import { EntriesKpiService } from './entries-kpi.service';

describe('EntriesKpiService', () => {
  let service: EntriesKpiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EntriesKpiService],
    }).compile();

    service = module.get<EntriesKpiService>(EntriesKpiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
