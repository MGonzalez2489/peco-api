import { BaseController } from '@common/controllers/base.controller';
import { ApiModelOkResponse, GetUser, Public } from '@common/decorators';
import { ResponseDto } from '@common/dtos/responses';
import { User } from '@datasource/entities';
import { Body, Controller, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ChangePasswordDto, RegisterDto, TokenDto } from '../dto';
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
        await this.service.registerAsync(registrationRequest);
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
    @Body() updatePasswordRequest: ChangePasswordDto,
    @GetUser() user: User,
  ): Promise<ResponseDto<TokenDto>> {
    try {
      const updatePasswordResponse = await this.service.changePasswordAsync(
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
