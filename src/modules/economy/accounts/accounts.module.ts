import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountService } from './services/account.service';
import { AccountController } from './controllers/account.controller';
import { Account } from 'src/datasource/entities/economy';

@Module({
  imports: [TypeOrmModule.forFeature([Account])],
  providers: [AccountService],
  exports: [AccountService],
  controllers: [AccountController],
})
export class AccountsModule {}
