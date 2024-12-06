import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PTypeOrmModule } from './datasource/typeorm.module';
import { databaseConfig } from './config';
import { AccountsModule } from './modules/accounts/accounts.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`${__dirname}/config/.env`],
      load: [databaseConfig],
    }),
    PTypeOrmModule,
    AccountsModule,
  ],
})
export class AppModule {}
