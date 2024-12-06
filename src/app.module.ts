import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PTypeOrmModule } from './datasource/typeorm.module';
import { databaseConfig } from './config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`${__dirname}/config/.env`],
      load: [databaseConfig],
    }),
    PTypeOrmModule,
  ],
})
export class AppModule {}
