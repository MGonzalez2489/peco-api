import { Test, TestingModule } from '@nestjs/testing';
import { AccountController } from './account.controller';
import { AccountService } from '../services/account.service';
import { User } from '@datasource/entities';
import { CreateAccountDto } from '../dto';
import { PageOptionsDto, PaginatedResponseDto } from '@common/dtos/pagination';
import { Account } from '@datasource/entities/economy';
import { ResponseDto } from '@common/dtos/responses';

describe('AccountController', () => {
  let controller: AccountController;
  let accountService: AccountService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountController],
      providers: [
        {
          provide: AccountService,
          useValue: {
            getAccountsByUserAsync: jest.fn(),
            getAccountByPublicIdAsync: jest.fn(),
            createAccountAsync: jest.fn(),
            updateAccountAsync: jest.fn(),
            deleteAccount: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AccountController>(AccountController);
    accountService = module.get<AccountService>(AccountService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(accountService).toBeDefined();
  });

  describe('getAllByUserId', () => {
    it('should call accountService.getAccountsByUserAsync with paginationDto and user', async () => {
      const paginationDto: PageOptionsDto = {
        page: 1,
        take: 10,
        skip: 0,
        showAll: false,
      };
      const user = { id: 1 } as User;
      await controller.getAllByUserId(paginationDto, user);
      expect(accountService.getAccountsByUserAsync).toHaveBeenCalledWith(
        paginationDto,
        user,
      );
    });

    it('should return the result of accountService.getAccountsByUserAsync', async () => {
      const paginationDto: PageOptionsDto = {
        page: 1,
        take: 10,
        skip: 0,
        showAll: false,
      };
      const user = { id: 1 } as User;
      const expectedResult = {} as PaginatedResponseDto<Account>;
      (accountService.getAccountsByUserAsync as jest.Mock).mockResolvedValue(
        expectedResult,
      );
      const result = await controller.getAllByUserId(paginationDto, user);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getAccountById', () => {
    it('should call accountService.getAccountByPublicIdAsync with accountId and user', async () => {
      const accountId = '123';
      const user = { id: 1 } as User;
      await controller.getAccountById(accountId, user);
      expect(accountService.getAccountByPublicIdAsync).toHaveBeenCalledWith(
        accountId,
        user,
      );
    });

    it('should return a ResponseDto with the result of accountService.getAccountByPublicIdAsync', async () => {
      const accountId = '123';
      const user = { id: 1 } as User;
      const expectedResult = { id: 1 } as Account;
      (accountService.getAccountByPublicIdAsync as jest.Mock).mockResolvedValue(
        expectedResult,
      );
      const result = await controller.getAccountById(accountId, user);
      expect(result).toEqual({
        statusCode: 200,
        isSuccess: true,
        data: expectedResult,
      } as ResponseDto<Account>);
    });
  });

  describe('create', () => {
    it('should call accountService.createAccountAsync with dto and user', async () => {
      const dto: CreateAccountDto = {
        name: 'Test Account',
        balance: 100,
        isDefault: false,
        accountTypeId: '123',
      };
      const user = { id: 1 } as User;
      await controller.create(dto, user);
      expect(accountService.createAccountAsync).toHaveBeenCalledWith(dto, user);
    });

    it('should return a ResponseDto with the result of accountService.createAccountAsync', async () => {
      const dto: CreateAccountDto = {
        name: 'Test Account',
        balance: 100,
        isDefault: false,
        accountTypeId: '123',
      };
      const user = { id: 1 } as User;
      const expectedResult = { id: 1 } as Account;
      (accountService.createAccountAsync as jest.Mock).mockResolvedValue(
        expectedResult,
      );
      const result = await controller.create(dto, user);
      expect(result).toEqual({
        statusCode: 200,
        isSuccess: true,
        data: expectedResult,
      } as ResponseDto<Account>);
    });
  });

  describe('update', () => {
    it('should call accountService.updateAccountAsync with dto, accountId, and user', async () => {
      const dto: CreateAccountDto = {
        name: 'Test Account',
        balance: 100,
        isDefault: false,
        accountTypeId: '123',
      };
      const accountId = '123';
      const user = { id: 1 } as User;
      await controller.update(dto, accountId, user);
      expect(accountService.updateAccountAsync).toHaveBeenCalledWith(
        dto,
        accountId,
        user,
      );
    });

    it('should return a ResponseDto with the result of accountService.updateAccountAsync', async () => {
      const dto: CreateAccountDto = {
        name: 'Test Account',
        balance: 100,
        isDefault: false,
        accountTypeId: '123',
      };
      const accountId = '123';
      const user = { id: 1 } as User;
      const expectedResult = { id: 1 } as Account;
      (accountService.updateAccountAsync as jest.Mock).mockResolvedValue(
        expectedResult,
      );
      const result = await controller.update(dto, accountId, user);
      expect(result).toEqual({
        statusCode: 200,
        isSuccess: true,
        data: expectedResult,
      } as ResponseDto<Account>);
    });
  });

  describe('delete', () => {
    it('should call accountService.deleteAccount with accountId and user', async () => {
      const accountId = '123';
      const user = { id: 1 } as User;
      await controller.delete(accountId, user);
      expect(accountService.deleteAccount).toHaveBeenCalledWith(
        accountId,
        user,
      );
    });

    it('should return a ResponseDto with the result of accountService.deleteAccount', async () => {
      const accountId = '123';
      const user = { id: 1 } as User;
      const expectedResult = true;
      (accountService.deleteAccount as jest.Mock).mockResolvedValue(
        expectedResult,
      );
      const result = await controller.delete(accountId, user);
      expect(result).toEqual({
        statusCode: 200,
        isSuccess: true,
        data: expectedResult,
      } as ResponseDto<boolean>);
    });
  });
});
