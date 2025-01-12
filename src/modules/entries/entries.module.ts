import { Module } from '@nestjs/common';
import { EntriesController } from './controllers/entries.controller';
import { EntriesService } from './services/entries.service';
import { AccountsModule } from '../accounts/accounts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Entry } from 'src/datasource/entities/entry.entity';
import { CategoriesModule } from '../categories/categories.module';
import { CatalogsModule } from '../catalogs/catalogs.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Entry]),
    AccountsModule,
    CategoriesModule,
    CatalogsModule,
  ],
  controllers: [EntriesController],
  providers: [EntriesService],
})
export class EntriesModule {}
