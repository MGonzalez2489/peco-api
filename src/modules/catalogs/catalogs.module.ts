import { Module } from '@nestjs/common';
import { CatalogsController } from './controllers/catalogs.controller';
import { CatalogsService } from './services/catalogs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntryType } from 'src/datasource/entities/catalogs';

@Module({
  imports: [TypeOrmModule.forFeature([EntryType])],
  controllers: [CatalogsController],
  providers: [CatalogsService],
  exports: [CatalogsService],
})
export class CatalogsModule {}
