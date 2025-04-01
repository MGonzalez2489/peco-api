import { ConfigNameEnum } from '@config/config-name.enum';
import { IJwtConfiguration } from '@config/iConfiguration.interface';
import { User } from '@datasource/entities';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { UserService } from '@users/services';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private userService: UserService,
    private configService: ConfigService,
  ) {
    const jwtConfig = configService.get<IJwtConfiguration>(ConfigNameEnum.jwt);

    super({
      secretOrKey: jwtConfig?.secret || 'test',
      ignoreExpiration: false, //jwtConfig.ignoreExpiration,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }
  async validate(payload: any): Promise<User> {
    const { sub } = payload;
    if (!sub) {
      throw new UnauthorizedException('Token no valido.');
    }

    const user = await this.userService.findUserByPublicIdAsync(sub);
    if (!user) {
      throw new UnauthorizedException('Token no valido.');
    }
    if (user.deletedAt) {
      throw new UnauthorizedException('Token no valido.');
    }

    return user;
  }
}
