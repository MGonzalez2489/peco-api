import { CommonModule } from '@common/common.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '@users/users.module';

export const generalImports = [
  ConfigModule,
  TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '1234',
    database: 'PECODBTEST',
    synchronize: true,
  }),
  UsersModule,
  PassportModule.register({
    defaultStrategy: 'jwt',
  }),
  JwtModule.register({
    secret: 'secret_test',
    signOptions: {
      expiresIn: '2h',
    },
  }),

  CommonModule,
];
