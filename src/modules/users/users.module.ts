import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/datasource/entities';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { AccountsModule } from '../accounts/accounts.module';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), AccountsModule, CommonModule],
  providers: [UserService],
  exports: [UserService],
  controllers: [UserController],
})
export class UsersModule {}
