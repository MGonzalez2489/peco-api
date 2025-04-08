import { CatalogsModule } from '@catalogs/catalogs.module';
import { Entry } from '@datasource/entities/economy';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntryCategoryModule } from '../entry-category/entry-category.module';
import { EntryController } from './controllers/entry.controller';
import { EntryKpiService } from './services/entry-kpi.service';
import { EntryService } from './services/entry.service';
import { AccountsModule } from '@accounts/accounts.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Entry]),
    forwardRef(() => AccountsModule),
    CatalogsModule,
    EntryCategoryModule,
  ],
  controllers: [EntryController],
  providers: [EntryService, EntryKpiService],
  exports: [EntryKpiService],
})
export class EntryModule {}
