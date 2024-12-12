import { Body, Controller, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { RegisterDto, TokenDto } from '../dto';
import { ApiModelOkResponse, GetUser, Public } from 'src/common/decorators';
import { User } from 'src/datasource/entities';
import { ResponseDto } from 'src/common/dtos/responses';
import { BaseController } from 'src/common/controllers/base.controller';

@Controller('auth')
@ApiTags('Auth')
export class AuthController extends BaseController<TokenDto> {
  constructor(private readonly service: AuthService) {
    super();
  }

  @Post('register')
  @ApiModelOkResponse(TokenDto)
  @Public()
  async register(@Body() dto: RegisterDto): Promise<ResponseDto<TokenDto>> {
    const result = await this.service.register(dto);
    return this.Response(result);
  }
  @Patch('secure')
  @ApiModelOkResponse(TokenDto)
  async secure(@Body() dto: RegisterDto, @GetUser() user: User) {
    const result = await this.service.updatePassword(dto, user);
    return this.Response(result);
  }

  @Post('signIn')
  @ApiModelOkResponse(TokenDto)
  @Public()
  async signIn(@Body() dto: RegisterDto): Promise<ResponseDto<TokenDto>> {
    const result = this.service.signIn(dto);
    return this.Response(result);
  }
}
