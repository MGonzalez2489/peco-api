import { Module } from '@nestjs/common';
import { CatalogsController } from './controllers/catalogs.controller';
import { CatalogsService } from './services/catalogs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntryCategoryController } from './controllers/entry-category.controller';
import { EntryCategory, EntryType } from 'src/datasource/entities/catalogs';
import { EntryCategoryService } from './services/entry-category.service';

@Module({
  imports: [TypeOrmModule.forFeature([EntryType, EntryCategory])],
  controllers: [CatalogsController, EntryCategoryController],
  providers: [CatalogsService, EntryCategoryService],
  exports: [CatalogsService, EntryCategoryService],
})
export class CatalogsModule {}
