import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  AccountType,
  EntryStatus,
  EntryType,
} from 'src/datasource/entities/catalogs';
import { CatalogsController } from './controllers/catalogs.controller';
import {
  CatAccountTypeService,
  CatalogsService,
  CatEntryTypeService,
} from './services';
import { CatEntryStatusService } from './services/cat-entry-status.service';

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
