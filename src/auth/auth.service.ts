import { Injectable } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  auth(user: User) {
    const payload = { sub: user.id };

    return { access_token: this.jwtService.sign(payload) };
  }

  async validatePassword(username: string, password: string) {
    const user = await this.usersService.findOne({ where: { username } });

    if (user) {
      return bcrypt
        .compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return null;
          }
          delete user.password;

          return user;
        })
        .catch(() => {
          return null;
        });
    }
  }
}
