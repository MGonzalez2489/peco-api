import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category, User } from 'src/datasource/entities';
import { AccountsModule } from '../accounts/accounts.module';
import { CommonModule } from 'src/common/common.module';
import { UserSeedService, UserService } from './services';
import { UserController } from './controllers';
import { CategoriesModule } from '../categories/categories.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Category]),
    AccountsModule,
    CategoriesModule,
    CommonModule,
  ],
  providers: [UserService, UserSeedService],
  exports: [UserService],
  controllers: [UserController],
})
export class UsersModule {}
