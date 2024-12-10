import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/modules/users/services/user.service';
import { RegisterDto, SignInDto } from '../dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(dto: SignInDto) {
    const user = await this.userService.findUserByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException();
    }

    if (!dto.password) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user.publicId };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async register(dto: RegisterDto) {
    const existingUser = await this.userService.findUserByEmail(dto.email);
    if (existingUser) {
      throw new BadRequestException('email already used.');
    }

    return await this.userService.create({ email: dto.email });
  }

  async updatePassword(dto: RegisterDto, userId: string) {
    if (!dto.password) {
      throw new BadRequestException('Password required');
    }

    const user = await this.userService.findUserByPublicId(userId);

    if (user && user.password) {
      const passwordMatch = await bcrypt.compare(dto.password, user.password);
      if (passwordMatch) {
        throw new BadRequestException('El password ya fue utilizado');
      }
    }

    const newPassword = await bcrypt.hash(dto.password, 10);

    await this.userService.updatePassword(newPassword, user.publicId);
    return user;
  }
}
