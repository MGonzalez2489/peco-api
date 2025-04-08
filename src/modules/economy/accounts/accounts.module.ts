import { CatalogsModule } from '@catalogs/catalogs.module';
import { Account } from '@datasource/entities/economy';
import { EntryModule } from '@entries/entry.module';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountController } from './controllers/account.controller';
import { AccountService } from './services/account.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Account]),
    CatalogsModule,
    forwardRef(() => EntryModule),
  ],
  providers: [AccountService],
  exports: [AccountService],
  controllers: [AccountController],
})
export class AccountsModule {}
