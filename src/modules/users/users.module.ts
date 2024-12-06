import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/datasource/entities';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
})
export class UsersModule {}
