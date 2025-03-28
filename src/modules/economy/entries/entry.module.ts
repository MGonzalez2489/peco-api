import { CatalogsModule } from '@catalogs/catalogs.module';
import { Entry } from '@datasource/entities/economy';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountsModule } from '../accounts/accounts.module';
import { EntryCategoryModule } from '../entry-category/entry-category.module';
import { EntryController } from './controllers/entry.controller';
import { EntryService } from './services/entry.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Entry]),
    AccountsModule,
    CatalogsModule,
    EntryCategoryModule,
  ],
  controllers: [EntryController],
  providers: [EntryService],
})
export class EntryModule {}
