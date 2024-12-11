import { Body, Controller, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { RegisterDto, TokenDto } from '../dto';
import { ApiModelOkResponse, GetUser, Public } from 'src/common/decorators';
import { User } from 'src/datasource/entities';
import { ResponseDto } from 'src/common/dtos/responses';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('register')
  @Public()
  register(@Body() dto: RegisterDto): Promise<ResponseDto<any>> {
    return this.service.register(dto);
  }
  @Patch('secure')
  @ApiModelOkResponse(TokenDto)
  secure(@Body() dto: RegisterDto, @GetUser() user: User) {
    return this.service.updatePassword(dto, user);
  }

  @Post('signIn')
  @ApiModelOkResponse(TokenDto)
  @Public()
  signIn(@Body() dto: RegisterDto) {
    return this.service.signIn(dto);
  }
}
