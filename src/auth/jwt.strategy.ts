import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../users/users.service';
import { jwtConstants } from './constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: any) {
    const { username, iat } = payload;

    const user = await this.userService.getUserByUsername(username);

    if (!user) throw new UnauthorizedException();

    const jwtTime = new Date(iat * 1000);

    if (jwtTime < user.passwordChangedAt) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
