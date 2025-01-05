import { Module } from '@nestjs/common';
import { CatalogsController } from './controllers/catalogs.controller';
import { CatalogsService } from './services/catalogs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatEntryType } from 'src/datasource/entities/catalogs';

@Module({
  imports: [TypeOrmModule.forFeature([CatEntryType])],
  controllers: [CatalogsController],
  providers: [CatalogsService],
})
export class CatalogsModule {}
