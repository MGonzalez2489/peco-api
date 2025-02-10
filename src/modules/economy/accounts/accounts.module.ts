import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountService } from './services/account.service';
import { AccountController } from './controllers/account.controller';
import { Account } from 'src/datasource/entities/economy';
import { CatalogsModule } from 'src/modules/catalogs/catalogs.module';

@Module({
  imports: [TypeOrmModule.forFeature([Account]), CatalogsModule],
  providers: [AccountService],
  exports: [AccountService],
  controllers: [AccountController],
})
export class AccountsModule {}
