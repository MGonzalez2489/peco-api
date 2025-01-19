import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/datasource/entities';
import { CommonModule } from 'src/common/common.module';
import { UserSeedService, UserService } from './services';
import { UserController } from './controllers';
import { AccountsModule } from '../economy';
import { CatalogsModule } from '../catalogs/catalogs.module';
import { EntryCategoryModule } from '../economy/entry-category/entry-category.module';

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
