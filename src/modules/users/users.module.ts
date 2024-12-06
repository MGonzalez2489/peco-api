import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/datasource/entities';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { AccountsModule } from '../accounts/accounts.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), AccountsModule],
  providers: [UserService],
  exports: [UserService],
  controllers: [UserController],
})
export class UsersModule {}
