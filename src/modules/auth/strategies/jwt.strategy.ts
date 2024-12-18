import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { UserService } from 'src/modules/users/services/user.service';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from 'src/datasource/entities';
import { jwtConfig } from 'src/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      secretOrKey: jwtConfig().jwt.secret,
      ignoreExpiration: false,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }
  async validate(payload: any): Promise<User> {
    const { publicId } = payload;
    console.log('payload', payload);
    const user = await this.userService.findUserByPublicId(publicId);
    if (!user) {
      throw new UnauthorizedException('Token no valido.');
    }
    if (user.deletedAt) {
      throw new UnauthorizedException('Token no valido.');
    }

    return user;
  }
}
