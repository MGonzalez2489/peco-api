import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from '../services/user.service';

@Controller('users')
@ApiTags('User')
export class UserController {
  constructor(private readonly service: UserService) {}
}
