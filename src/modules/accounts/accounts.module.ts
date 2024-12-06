import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from 'src/datasource/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Account])],
})
export class AccountsModule {}
