import { BaseController } from '@common/controllers/base.controller';
import { GetUser } from '@common/decorators';
import { User } from '@datasource/entities';
import { Body, Controller, Get, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UpdateUserDto } from '../dto';
import { UserService } from '../services/user.service';

@Controller('user')
@ApiTags('User')
export class UserController extends BaseController<User> {
  constructor(private readonly service: UserService) {
    super();
  }

  @Get()
  getUser(@GetUser() user: User) {
    return this.Response(user);
  }

  @Put()
  async update(@GetUser() user: User, @Body() dto: UpdateUserDto) {
    const result = await this.service.update(user, dto);
    return this.Response(result);
  }
}
