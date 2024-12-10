import { Body, Controller, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { RegisterDto } from '../dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.service.register(dto);
  }
  @Patch('secure')
  secure(@Body() dto: RegisterDto) {
    return this.service.updatePassword(
      dto,
      '4a387950-bd13-47f8-b2c5-e5de05127ebb',
    );
  }

  @Post('signIn')
  signIn(@Body() dto: RegisterDto) {
    return this.service.signIn(dto);
  }
}
