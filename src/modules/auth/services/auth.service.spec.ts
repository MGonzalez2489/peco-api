import { ChangePasswordDto, RegisterDto, SignInDto, TokenDto } from '@auth/dto';
import { CryptService } from '@common/services';
import { User } from '@datasource/entities';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '@users/services';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;
  let jwtService: JwtService;
  let cryptoService: CryptService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            findUserByEmailAsync: jest.fn(),
            createAsync: jest.fn(),
            updatePasswordAsync: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
            decode: jest.fn(),
          },
        },
        {
          provide: CryptService,
          useValue: {
            compare: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
    cryptoService = module.get<CryptService>(CryptService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signInAsync', () => {
    const signInDto: SignInDto = {
      email: 'test@example.com',
      password: 'password123',
    };
    const user: User = {
      publicId: 'user-public-id',
      email: signInDto.email,
      password: 'hashedPassword',
    } as User;
    const token = 'testToken';
    const decodedToken = { exp: Date.now() / 1000 + 3600 };

    it('should sign in a user and return a token', async () => {
      (userService.findUserByEmailAsync as jest.Mock).mockResolvedValue(user);
      (cryptoService.compare as jest.Mock).mockResolvedValue(true);
      (jwtService.signAsync as jest.Mock).mockResolvedValue(token);
      (jwtService.decode as jest.Mock).mockReturnValue(decodedToken);

      const result: TokenDto = await service.signInAsync(signInDto);

      expect(userService.findUserByEmailAsync).toHaveBeenCalledWith(
        signInDto.email,
      );
      expect(cryptoService.compare).toHaveBeenCalledWith(
        signInDto.password,
        user.password,
      );
      expect(jwtService.signAsync).toHaveBeenCalledWith({ sub: user.publicId });
      expect(result).toEqual({
        access_token: token,
        expiresAt: expect.any(String),
      });
    });
    it('should throw UnauthorizedException if password is not provided', async () => {
      await expect(
        service.signInAsync({ email: signInDto.email, password: '' }),
      ).rejects.toThrow(BadRequestException);
    });
    it('should throw NotFoundException if user is not found', async () => {
      (userService.findUserByEmailAsync as jest.Mock).mockResolvedValue(null);

      await expect(service.signInAsync(signInDto)).rejects.toThrow(
        NotFoundException,
      );
    });
    it('should throw UnauthorizedException if password does not match', async () => {
      (userService.findUserByEmailAsync as jest.Mock).mockResolvedValue(user);
      (cryptoService.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.signInAsync(signInDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('registerAsync', () => {
    const registerDto: RegisterDto = {
      email: 'new@example.com',
      password: 'newPassword',
    };

    const token = 'newToken';
    const decodedToken = { exp: Date.now() / 1000 + 3600 };
    const tokenDto: TokenDto = {
      access_token: token,
      expiresAt: new Date(decodedToken.exp * 1000).toISOString(),
    };

    it('should register a new user and return a token', async () => {
      (userService.findUserByEmailAsync as jest.Mock).mockResolvedValue(null);
      (userService.createAsync as jest.Mock).mockResolvedValue(undefined);
      service.signInAsync = jest.fn().mockResolvedValue(tokenDto);

      const result: TokenDto = await service.registerAsync(registerDto);

      expect(userService.findUserByEmailAsync).toHaveBeenCalledWith(
        registerDto.email,
      );
      expect(userService.createAsync).toHaveBeenCalledWith({
        email: registerDto.email,
        password: registerDto.password,
      });
      expect(result).toEqual({
        access_token: token,
        expiresAt: expect.any(String),
      });
    });

    it('should throw BadRequestException if email or password is missing', async () => {
      await expect(
        service.registerAsync({ ...registerDto, email: '' }),
      ).rejects.toThrow(BadRequestException);
      await expect(
        service.registerAsync({ ...registerDto, password: '' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw ConflictException if email is already in use', async () => {
      (userService.findUserByEmailAsync as jest.Mock).mockResolvedValue({});

      await expect(service.registerAsync(registerDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('changePasswordAsync', () => {
    const changePasswordDto: ChangePasswordDto = {
      currentPassword: 'oldPassword',
      newPassword: 'newPassword',
    };
    const user: User = {
      publicId: 'user-public-id',
      password: 'hashedOldPassword',
    } as User;

    it('should change the user password', async () => {
      (cryptoService.compare as jest.Mock).mockResolvedValue(true);
      (userService.updatePasswordAsync as jest.Mock).mockResolvedValue(
        undefined,
      );

      const result: User = await service.changePasswordAsync(
        changePasswordDto,
        user,
      );

      expect(cryptoService.compare).toHaveBeenCalledWith(
        changePasswordDto.currentPassword,
        user.password,
      );
      expect(userService.updatePasswordAsync).toHaveBeenCalledWith(
        changePasswordDto.newPassword,
        user.publicId,
      );
      expect(result).toEqual(user);
    });

    it('should throw BadRequestException if current or new password is missing', async () => {
      await expect(
        service.changePasswordAsync(
          { ...changePasswordDto, currentPassword: '' },
          user,
        ),
      ).rejects.toThrow(BadRequestException);
      await expect(
        service.changePasswordAsync(
          { ...changePasswordDto, newPassword: '' },
          user,
        ),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if current password is incorrect', async () => {
      (cryptoService.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.changePasswordAsync(changePasswordDto, user),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if new password is the same as current password', async () => {
      await expect(
        service.changePasswordAsync(
          { currentPassword: 'samePassword', newPassword: 'samePassword' },
          user,
        ),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
