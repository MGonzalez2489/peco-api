import { JwtStrategy } from '@auth/strategies';
import { createMock } from '@golevelup/ts-jest'; //

import { ExecutionContext } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test } from '@nestjs/testing';
import { UserService } from '@users/services';
import { JwtAuthGuard } from './auth.guard';

describe('JwtAuthGuard', () => {
  let jwtAuthGuard: JwtAuthGuard;
  let reflector: Reflector;
  let context: ExecutionContext;
  let userService: UserService;

  let jwtService: JwtService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
          secret: 'test',
          signOptions: { expiresIn: '2m' },
        }),
      ],
      providers: [
        JwtAuthGuard,
        Reflector,
        JwtStrategy,
        {
          provide: UserService,
          useValue: {
            findUserByPublicIdAsync: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ], // Incluye JwtStrategy
    }).compile();

    jwtAuthGuard = moduleRef.get<JwtAuthGuard>(JwtAuthGuard);
    reflector = moduleRef.get<Reflector>(Reflector);
    context = createMock<ExecutionContext>();
    userService = moduleRef.get<UserService>(UserService);

    jwtService = moduleRef.get<JwtService>(JwtService);
  });

  describe('canActivate', () => {
    it('should return true if route is public', () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(true);
      const result = jwtAuthGuard.canActivate(context);
      expect(result).toBe(true);
    });

    it('should call super.canActivate if route is not public', async () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false); //isPublic
      const testPublicId = '12341234';
      (userService.findUserByPublicIdAsync as jest.Mock).mockResolvedValue({
        id: 1,
        publicId: testPublicId,
        email: 'hola@test.com',
      });

      const token = jwtService.sign({ sub: testPublicId });

      const mockContext = createMock<ExecutionContext>({
        switchToHttp: () => ({
          getRequest: () => ({
            headers: {
              authorization: `Bearer ${token}`, // Asegurar el formato correcto
            },
            // Add other properties as needed
          }),
          getResponse: jest.fn(),
        }),
      });

      const superCanActivateSpy = jest.spyOn(
        Object.getPrototypeOf(jwtAuthGuard),
        'canActivate',
      );

      await jwtAuthGuard.canActivate(mockContext);
      expect(superCanActivateSpy).toHaveBeenCalledWith(mockContext);
    });
  });
});
