import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from '../services/user.service';
import { UserCreateDto } from '../dto';

@Controller('users')
@ApiTags('User')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Post()
  create(@Body() createDto: UserCreateDto) {
    return this.service.create(createDto);
  }
}
