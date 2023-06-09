import {
  Controller,
  Post,
  UseGuards,
  Req,
  Body,
  SerializeOptions,
  ConflictException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { LocalGuard } from './local.guard';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthRequest } from 'src/utils/types';
import { QueryFailedError } from 'typeorm';
import { userAlreadyExist } from 'src/utils/constants';

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
    try {
      return await this.usersService.create(createUserDto);
    } catch (err) {
      if (err instanceof QueryFailedError) {
        if (err.driverError.code === '23505') {
          throw new ConflictException(userAlreadyExist);
        }
      }
    }
  }
}
