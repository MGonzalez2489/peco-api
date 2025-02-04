import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from '../services/user.service';
import { GetUser } from 'src/common/decorators';
import { User } from 'src/datasource/entities';
import { BaseController } from 'src/common/controllers/base.controller';

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
}
