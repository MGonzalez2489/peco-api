import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PTypeOrmModule } from './datasource/typeorm.module';
import { databaseConfig } from './config';
import { AccountsModule } from './modules/accounts/accounts.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`${__dirname}/config/.env`],
      load: [databaseConfig],
    }),
    PTypeOrmModule,
    AccountsModule,
    UsersModule,
  ],
})
export class AppModule {}
