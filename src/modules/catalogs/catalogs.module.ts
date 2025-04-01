import {
  AccountType,
  EntryStatus,
  EntryType,
} from '@datasource/entities/catalogs';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  CatAccountTypeService,
  CatalogsService,
  CatEntryTypeService,
} from './services';
import { CatEntryStatusService } from './services/cat-entry-status.service';
import { CatalogsController } from './controllers/catalogs.controller';

@Module({
  imports: [TypeOrmModule.forFeature([EntryType, EntryStatus, AccountType])],
  controllers: [CatalogsController],
  providers: [
    CatalogsService,
    CatEntryTypeService,
    CatEntryStatusService,
    CatAccountTypeService,
  ],
  exports: [
    CatalogsService,
    CatEntryTypeService,
    CatEntryStatusService,
    CatAccountTypeService,
  ],
})
export class CatalogsModule {}
