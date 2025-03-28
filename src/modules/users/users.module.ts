import { CommonModule } from '@common/common.module';
import { User } from '@datasource/entities';
import { EntryCategoryModule } from '@entry-category/entry-category.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatalogsModule } from '../catalogs/catalogs.module';
import { AccountsModule } from '../economy';
import { UserController } from './controllers';
import { UserSeedService, UserService } from './services';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    AccountsModule,
    CommonModule,
    CatalogsModule,
    EntryCategoryModule,
  ],
  providers: [UserService, UserSeedService],
  exports: [UserService],
  controllers: [UserController],
})
export class UsersModule {}
