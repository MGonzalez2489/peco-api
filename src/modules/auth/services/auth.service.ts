import {
  BadRequestException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/modules/users/services/user.service';
import { RegisterDto, SignInDto, TokenDto } from '../dto';
import { User } from 'src/datasource/entities';
import { UserConstants } from 'src/common/constants';
import { CryptService } from 'src/common/services';
import { ResponseDto } from 'src/common/dtos/responses';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private cryptoService: CryptService,
  ) {}

  async signIn(dto: SignInDto): Promise<ResponseDto<TokenDto>> {
    const user = await this.userService.findUserByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException();
    }

    if (!dto.password) {
      throw new UnauthorizedException();
    }

    const passwordMatch = await this.cryptoService.compare(
      dto.password,
      user.password,
    );

    if (!passwordMatch) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user.publicId };
    const res: TokenDto = {
      access_token: await this.jwtService.signAsync(payload),
    };

    return new ResponseDto(res, HttpStatus.OK);
  }

  async register(dto: RegisterDto): Promise<ResponseDto<TokenDto>> {
    const existingUser = await this.userService.findUserByEmail(dto.email);
    if (existingUser) {
      throw new BadRequestException('email already used.');
    }

    const newUser = await this.userService.create({ email: dto.email });

    return await this.signIn({
      email: newUser.email,
      password: UserConstants.DEFAULT_PASSWORD,
    });
  }

  async updatePassword(
    dto: RegisterDto,
    user: User,
  ): Promise<ResponseDto<any>> {
    if (!dto.password) {
      throw new BadRequestException('Password required');
    }

    if (user.password) {
      const passwordMatch = await this.cryptoService.compare(
        dto.password,
        user.password,
      );

      if (passwordMatch) {
        throw new BadRequestException('El password ya fue utilizado');
      }
    }

    await this.userService.updatePassword(dto.password, user.publicId);

    return new ResponseDto(user, HttpStatus.OK);
  }
}
