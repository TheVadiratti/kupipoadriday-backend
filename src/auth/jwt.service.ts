import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'JwtSecret',
    });
  }

  async validate(jwtPayload: { sub: number }) {
    const user = await this.usersService.findOne({
      where: { id: jwtPayload.sub },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return this.usersService.deletePassword(user);
  }
}
