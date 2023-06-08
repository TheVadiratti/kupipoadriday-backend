import {
  Controller,
  Post,
  UseGuards,
  Req,
  Body,
  SerializeOptions,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { LocalGuard } from './local.guard';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthRequest } from 'src/types';

@Controller()
export class AuthController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @UseGuards(LocalGuard)
  @Post('signin')
  signin(@Req() req: AuthRequest) {
    /* Генерируем для пользователя JWT-токен */
    return this.authService.auth(req.user);
  }

  @Post('signup')
  @SerializeOptions({ groups: ['owner'] })
  async signup(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }
}
