import { CatalogsModule } from '@catalogs/catalogs.module';
import { Account } from '@datasource/entities/economy';
import { EntryModule } from '@entries/entry.module';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountKpiController } from './controllers/account-kpi.controller';
import { AccountController } from './controllers/account.controller';
import { AccountService } from './services/account.service';
import { AccountsKpiService } from './services/accounts-kpi.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Account]),
    CatalogsModule,
    forwardRef(() => EntryModule),
  ],
  providers: [AccountService, AccountsKpiService],
  exports: [AccountService],
  controllers: [AccountController, AccountKpiController],
})
export class AccountsModule {}
