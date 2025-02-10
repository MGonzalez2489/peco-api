import { Body, Controller, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BaseController } from 'src/common/controllers/base.controller';
import { ApiModelOkResponse, GetUser, Public } from 'src/common/decorators';
import { ResponseDto } from 'src/common/dtos/responses';
import { User } from 'src/datasource/entities';
import { RegisterDto, TokenDto } from '../dto';
import { AuthService } from '../services/auth.service';

@Controller('auth')
@ApiTags('Auth')
export class AuthController extends BaseController<TokenDto> {
  constructor(private readonly service: AuthService) {
    super();
  }

  @Post('register')
  @ApiModelOkResponse(TokenDto)
  @Public()
  async register(
    @Body() registrationRequest: RegisterDto,
  ): Promise<ResponseDto<TokenDto>> {
    try {
      const registrationResponse =
        await this.service.register(registrationRequest);
      return this.Response(registrationResponse);
    } catch (error) {
      // Handle the error
      console.error(error);
      throw error;
    }
  }

  @Patch('secure')
  @ApiModelOkResponse(TokenDto)
  async secure(
    @Body() updatePasswordRequest: RegisterDto,
    @GetUser() user: User,
  ): Promise<ResponseDto<TokenDto>> {
    try {
      const updatePasswordResponse = await this.service.updatePassword(
        updatePasswordRequest,
        user,
      );
      return this.Response(updatePasswordResponse);
    } catch (error) {
      // Handle the error
      console.error(error);
      throw error;
    }
  }

  @Post('signIn')
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
      console.error(error);
      throw error;
    }
  }
}
