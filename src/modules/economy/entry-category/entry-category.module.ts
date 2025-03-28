import { EntryCategory } from '@datasource/entities/economy';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntryCategoryController } from './controllers/entry-category.controller';
import { EntryCategoryService } from './services/entry-category.service';

@Module({
  imports: [TypeOrmModule.forFeature([EntryCategory])],
  controllers: [EntryCategoryController],
  providers: [EntryCategoryService],
  exports: [EntryCategoryService],
})
export class EntryCategoryModule {}
