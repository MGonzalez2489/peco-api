import { RegisterDto, TokenDto } from '@auth/dto';
import { AuthService } from '@auth/services/auth.service';
import { ResponseDto } from '@common/dtos/responses';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            registerAsync: jest.fn(),
            signInAsync: jest.fn(),
            changePasswordAsync: jest.fn(),
          },
        },
      ],
    }).compile();
    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('shouild call authService.registerAsync with the provided registerDto', async () => {
      const dto: RegisterDto = {
        email: 'test@test.com',
        password: '12345',
      };
      const tokenDto: TokenDto = { access_token: 'testToken', expiresAt: '' };
      (service.registerAsync as jest.Mock).mockResolvedValue(tokenDto);
      await controller.register(dto);
      expect(service.registerAsync).toHaveBeenCalledWith(dto);
    });

    it('should return a ResponseDto with the tokenDto on success', async () => {
      const registerDto: RegisterDto = {
        email: 'test@example.com',
        password: 'password123',
      };
      const tokenDto: TokenDto = { access_token: 'testToken', expiresAt: '' };
      (service.registerAsync as jest.Mock).mockResolvedValue(tokenDto);

      const result: ResponseDto<TokenDto> =
        await controller.register(registerDto);

      expect(result).toEqual({
        statusCode: 200,
        isSuccess: true,
        data: tokenDto,
      });
    });

    it('should handle errors from authService.registerAsync', async () => {
      const registerDto: RegisterDto = {
        email: 'test@example.com',
        password: 'password123',
      };
      const error = new Error('Registration failed');
      (service.registerAsync as jest.Mock).mockRejectedValue(error);

      await expect(controller.register(registerDto)).rejects.toThrow(error);
    });
  });

  describe('signIn', () => {
    it('should call authService.signInAsync with the provided signInDto', async () => {
      const dto: RegisterDto = {
        email: 'test@test.com',
        password: '12345',
      };
      const tokenDto: TokenDto = { access_token: 'testToken', expiresAt: '' };
      (service.signInAsync as jest.Mock).mockResolvedValue(tokenDto);
      await controller.signIn(dto);
      expect(service.signInAsync).toHaveBeenCalledWith(dto);
    });

    it('should return a ResponseDto with the tokenDto on success', async () => {
      const signInDto: RegisterDto = {
        email: 'test@example.com',
        password: 'password123',
      };
      const tokenDto: TokenDto = { access_token: 'testToken', expiresAt: '' };
      (service.signInAsync as jest.Mock).mockResolvedValue(tokenDto);

      const result: ResponseDto<TokenDto> = await controller.signIn(signInDto);

      expect(result).toEqual({
        statusCode: 200,
        isSuccess: true,
        data: tokenDto,
      });
    });

    it('should handle errors from authService.signInAsync', async () => {
      const signInDto: RegisterDto = {
        email: 'test@example.com',
        password: 'password123',
      };
      const error = new Error('SignIn failed');
      (service.signInAsync as jest.Mock).mockRejectedValue(error);

      await expect(controller.signIn(signInDto)).rejects.toThrow(error);
    });
  });
});
