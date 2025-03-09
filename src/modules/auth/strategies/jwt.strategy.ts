import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigNameEnum } from 'src/config/config-name.enum';
import { IJwtConfiguration } from 'src/config/iConfiguration.interface';
import { User } from 'src/datasource/entities';
import { UserService } from 'src/modules/users/services/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private userService: UserService,
    private configService: ConfigService,
  ) {
    const jwtConfig = configService.get<IJwtConfiguration>(ConfigNameEnum.jwt);
    super({
      secretOrKey: jwtConfig.secret,
      ignoreExpiration: false, //jwtConfig.ignoreExpiration,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }
  async validate(payload: any): Promise<User> {
    const { sub } = payload;
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
