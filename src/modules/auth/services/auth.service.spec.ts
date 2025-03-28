import { JwtStrategy } from '@auth/strategies';
import { CommonModule } from '@common/common.module';
import { ConfigNameEnum } from '@config/config-name.enum';
import configuration from '@config/configuration';
import { IJwtConfiguration } from '@config/iConfiguration.interface';
import { PTypeOrmModule } from '@datasource/typeorm.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersModule } from '@users/users.module';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  const envFilePath = `${__dirname}/../../${process.env.NODE_ENV || ''}.env`;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [configuration],
          ignoreEnvFile: false,
          envFilePath: [envFilePath],
          isGlobal: true,
        }),
        PTypeOrmModule,

        PassportModule.register({
          defaultStrategy: 'jwt',
        }),
        JwtModule.registerAsync({
          inject: [ConfigService],
          useFactory: async (configService: ConfigService) => {
            const jwtConfig = configService.get<IJwtConfiguration>(
              ConfigNameEnum.jwt,
            );
            return {
              secret: jwtConfig.secret,
              signOptions: { expiresIn: jwtConfig.expiresIn },
            };
          },
        }),
        UsersModule,
        CommonModule,
      ],
      providers: [AuthService, JwtStrategy],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
