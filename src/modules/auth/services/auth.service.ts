import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/modules/users/services/user.service';
import { RegisterDto, SignInDto, TokenDto } from '../dto';
import { User } from 'src/datasource/entities';
import { BaseService, CryptService } from 'src/common/services';

@Injectable()
export class AuthService extends BaseService<any> {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private cryptoService: CryptService,
  ) {
    super();
  }

  async signIn(dto: SignInDto): Promise<TokenDto> {
    const user = await this.userService.findUserByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('User not found');
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

    return res;
  }

  async register(dto: RegisterDto): Promise<TokenDto> {
    try {
      const existingUser = await this.userService.findUserByEmail(dto.email);
      if (existingUser) {
        throw new BadRequestException('email already used.');
      }

      const newUser = await this.userService.create({
        email: dto.email,
        password: dto.password,
      });

      return await this.signIn({
        email: newUser.email,
        password: dto.password,
      });
    } catch (error) {
      this.ThrowException('AuthService::register', error);
    }
  }

  async updatePassword(dto: RegisterDto, user: User): Promise<User> {
    try {
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
      return user;
    } catch (error) {
      this.ThrowException('AuthService::updateUser', error);
    }
  }
}
