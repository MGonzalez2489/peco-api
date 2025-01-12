import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { UserService } from 'src/modules/users/services/user.service';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from 'src/datasource/entities';
import { ConfigService } from '@nestjs/config';
import { IJwtConfiguration } from 'src/config/iConfiguration.interface';
import { ConfigNameEnum } from 'src/config/config-name.enum';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private userService: UserService,
    private configService: ConfigService,
  ) {
    const jwtConfig = configService.get<IJwtConfiguration>(ConfigNameEnum.jwt);
    super({
      secretOrKey: jwtConfig.secret,
      ignoreExpiration: true, //jwtConfig.ignoreExpiration,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }
  async validate(payload: any): Promise<User> {
    const { publicId } = payload;
    const user = await this.userService.findUserByPublicId(publicId);
    // if (!user) {
    //   throw new UnauthorizedException('Token no valido.');
    // }
    // if (user.deletedAt) {
    //   throw new UnauthorizedException('Token no valido.');
    // }

    return user;
  }
}
