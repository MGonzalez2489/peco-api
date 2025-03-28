import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatalogsModule } from 'src/modules/catalogs/catalogs.module';
import { EntryCategoryModule } from '../entry-category/entry-category.module';
import { PlannedEntry } from './../../../datasource/entities/economy/planned-entry.entity';
import { PlannedEntriesController } from './controllers/planned-entries.controller';
import { PlannedEntriesService } from './services/planned-entries.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PlannedEntry]),
    CatalogsModule,
    EntryCategoryModule,
  ],
  controllers: [PlannedEntriesController],
  providers: [PlannedEntriesService],
})
export class PlannedEntriesModule {}
