import { Module } from '@nestjs/common';
import { CatalogsController } from './controllers/catalogs.controller';
import { CatalogsService } from './services/catalogs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntryCategoryController } from './controllers/entry-category.controller';
import { EntryCategoryService } from './services/entry-category.service';
import { EntryType } from 'src/datasource/entities/catalogs';
import { EntryCategory } from 'src/datasource/entities/economy';

@Module({
  imports: [TypeOrmModule.forFeature([EntryType, EntryCategory])],
  controllers: [CatalogsController, EntryCategoryController],
  providers: [CatalogsService, EntryCategoryService],
  exports: [CatalogsService, EntryCategoryService],
})
export class CatalogsModule {}
