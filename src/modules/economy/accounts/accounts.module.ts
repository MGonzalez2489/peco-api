import { CatalogsModule } from '@catalogs/catalogs.module';
import { Account } from '@datasource/entities/economy';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountController } from './controllers/account.controller';
import { AccountService } from './services/account.service';

@Module({
  imports: [TypeOrmModule.forFeature([Account]), CatalogsModule],
  providers: [AccountService],
  exports: [AccountService],
  controllers: [AccountController],
})
export class AccountsModule {}
