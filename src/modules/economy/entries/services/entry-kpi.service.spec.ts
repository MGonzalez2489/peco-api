import { Test, TestingModule } from '@nestjs/testing';
import { EntryKpiService } from './entry-kpi.service';

describe('EntryKpiService', () => {
  let service: EntryKpiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EntryKpiService],
    }).compile();

    service = module.get<EntryKpiService>(EntryKpiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
