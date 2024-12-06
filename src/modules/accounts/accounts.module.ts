import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from 'src/datasource/entities';
import { AccountService } from './services/account.service';
import { AccountController } from './controllers/account.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Account])],
  providers: [AccountService],
  exports: [AccountService],
  controllers: [AccountController],
})
export class AccountsModule {}
