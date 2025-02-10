import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { BaseService, CryptService } from 'src/common/services';
import { User } from 'src/datasource/entities';
import { UserService } from 'src/modules/users/services/user.service';
import { RegisterDto, SignInDto, TokenDto } from '../dto';

@Injectable()
export class AuthService extends BaseService<any> {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private cryptoService: CryptService,
  ) {
    super();
  }

  /**
   * Signs in a user using the provided email and password.
   *
   * @param signInRequest - The sign in request object containing the user's email and password.
   * @returns A promise resolving to a token DTO containing the access token.
   */
  async signInAsync(signInRequest: SignInDto): Promise<TokenDto> {
    try {
      const user = await this.userService.findUserByEmailAsync(
        signInRequest.email,
      );
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      if (!signInRequest.password) {
        throw new UnauthorizedException('Password is required');
      }

      const passwordMatch = await this.cryptoService.compare(
        signInRequest.password,
        user.password,
      );

      if (!passwordMatch) {
        throw new UnauthorizedException('Invalid password');
      }

      const payload = { sub: user.publicId };
      const token = await this.jwtService.signAsync(payload);
      const res: TokenDto = {
        access_token: token,
      };

      return res;
    } catch (error) {
      this.ThrowException('UserService::findUserByEmail', error);
    }
  }

  async register(dto: RegisterDto): Promise<TokenDto> {
    try {
      const existingUser = await this.userService.findUserByEmailAsync(
        dto.email,
      );
      if (existingUser) {
        throw new BadRequestException('email already used.');
      }

      const newUser = await this.userService.create({
        email: dto.email,
        password: dto.password,
      });

      return await this.signInAsync({
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
