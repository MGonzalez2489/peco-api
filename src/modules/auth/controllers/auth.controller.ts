import { AuthService } from '@auth/services/auth.service';
import { BaseController } from '@common/controllers/base.controller';
import { ApiModelOkResponse, Public } from '@common/decorators';
import { ResponseDto } from '@common/dtos/responses';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RegisterDto, TokenDto } from '../dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController extends BaseController<TokenDto> {
  constructor(private readonly service: AuthService) {
    super();
  }

  @Post('login')
  @ApiModelOkResponse(TokenDto)
  @Public()
  async signIn(
    @Body() signInRequest: RegisterDto,
  ): Promise<ResponseDto<TokenDto>> {
    try {
      const signInResponse = await this.service.signInAsync(signInRequest);
      return this.Response(signInResponse);
    } catch (error) {
      // Handle the error
      throw error;
    }
  }

  @Post('register')
  @ApiModelOkResponse(TokenDto)
  @Public()
  async register(
    @Body() registrationRequest: RegisterDto,
  ): Promise<ResponseDto<TokenDto>> {
    try {
      const registrationResponse =
        await this.service.registerAsync(registrationRequest);
      return this.Response(registrationResponse);
    } catch (error) {
      // Handle the error
      throw error;
    }
  }
}
