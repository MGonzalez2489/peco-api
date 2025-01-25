import { Module } from '@nestjs/common';
import { EntryService } from './services/entry.service';
import { AccountsModule } from '../accounts/accounts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Entry } from 'src/datasource/entities/economy';
import { CatalogsModule } from 'src/modules/catalogs/catalogs.module';
import { EntryController } from './controllers/entry.controller';
import { EntryCategoryModule } from '../entry-category/entry-category.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Entry]),
    AccountsModule,
    CatalogsModule,
    EntryCategoryModule,
  ],
  controllers: [EntryController],
  providers: [EntryService],
})
export class EntryModule {}
