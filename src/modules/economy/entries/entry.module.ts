import { AccountsModule } from '@accounts/accounts.module';
import { CatalogsModule } from '@catalogs/catalogs.module';
import { Entry } from '@datasource/entities/economy';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntryCategoryModule } from '../entry-category/entry-category.module';
import { EntryController } from './controllers/entry.controller';
import { EntryService, EntriesKpiService } from './services';

@Module({
  imports: [
    TypeOrmModule.forFeature([Entry]),
    forwardRef(() => AccountsModule),
    CatalogsModule,
    EntryCategoryModule,
  ],
  controllers: [EntryController],
  providers: [EntryService, EntriesKpiService],
  exports: [EntryService, EntriesKpiService],
})
export class EntryModule {}
