import { AuthService } from '@auth/services/auth.service';
import { Test, TestingModule } from '@nestjs/testing';
import { getDataSourceToken } from '@nestjs/typeorm';
import { generalImports } from '@test/test-imports';
import { DataSource } from 'typeorm';
import { AuthController } from './auth.controller';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;
  let dataSource: DataSource;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...generalImports],
      providers: [AuthService],
      controllers: [AuthController],
    }).compile();

    dataSource = module.get<DataSource>(getDataSourceToken());
    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });
  afterAll(async () => {
    if (dataSource) {
      await dataSource.destroy();
    }
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  it('should regtister a new user', () => {});
});
