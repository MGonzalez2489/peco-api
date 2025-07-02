import { AccountsModule } from '@accounts/accounts.module';
import { CatalogsModule } from '@catalogs/catalogs.module';
import { CommonModule } from '@common/common.module';
import { User } from '@datasource/entities';
import { EntryModule } from '@entries/entry.module';
import { EntryCategoryModule } from '@entry-category/entry-category.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StorageModule } from '@storage/storage.module';
import { StorageProvider } from '@storage/storage.provider';
import { UserController } from './controllers';
import { UserSeedService, UserService } from './services';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    AccountsModule,
    CommonModule,
    CatalogsModule,
    EntryCategoryModule,
    StorageModule,
    EntryModule,
  ],
  providers: [UserService, UserSeedService, StorageProvider],
  exports: [UserService],
  controllers: [UserController],
})
export class UsersModule {}
