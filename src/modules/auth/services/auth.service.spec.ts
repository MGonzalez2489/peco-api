import { Test, TestingModule } from '@nestjs/testing';
import { getDataSourceToken } from '@nestjs/typeorm';
import { generalImports } from '@test/test-imports';
import { DataSource } from 'typeorm';
import { JwtStrategy } from '../strategies';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let dataSource: DataSource;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...generalImports],
      providers: [AuthService, JwtStrategy],
    }).compile();
    dataSource = module.get<DataSource>(getDataSourceToken());

    service = module.get<AuthService>(AuthService);
  });
  afterAll(async () => {
    if (dataSource) {
      await dataSource.destroy();
    }
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
