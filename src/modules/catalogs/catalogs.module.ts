import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountType, EntryType } from 'src/datasource/entities/catalogs';
import { CatalogsController } from './controllers/catalogs.controller';
import {
  CatAccountTypeService,
  CatalogsService,
  CatEntryTypeService,
} from './services';

@Module({
  imports: [TypeOrmModule.forFeature([EntryType, AccountType])],
  controllers: [CatalogsController],
  providers: [CatalogsService, CatEntryTypeService, CatAccountTypeService],
  exports: [CatalogsService, CatEntryTypeService, CatAccountTypeService],
})
export class CatalogsModule {}
