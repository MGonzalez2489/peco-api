import { Body, Controller, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { RegisterDto } from '../dto';
import { GetUser, Public } from 'src/common/decorators';
import { User } from 'src/datasource/entities';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('register')
  @Public()
  register(@Body() dto: RegisterDto) {
    return this.service.register(dto);
  }
  @Patch('secure')
  secure(@Body() dto: RegisterDto, @GetUser() user: User) {
    return this.service.updatePassword(dto, user);
  }

  @Post('signIn')
  @Public()
  signIn(@Body() dto: RegisterDto) {
    return this.service.signIn(dto);
  }
}
