import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  UseGuards,
  Req,
  Param,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindUserDto } from './dto/find-users.dto';
import { JwtGuard } from '../auth/auth.guard';
import { AuthRequest } from '../types';

@Controller('users')
@UseGuards(JwtGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get('me')
  async findOwn(@Req() req: AuthRequest) {
    const user = await this.usersService.findOne({
      where: { username: req.user.username },
    });
    return this.usersService.deletePassword(user);
  }

  @Get(':username')
  async findOne(@Param('username') username: string) {
    const user = await this.usersService.findOne({ where: { username } });
    return this.usersService.deletePassword(user);
  }

  @Patch('me')
  async update(@Req() req: AuthRequest, @Body() updateUserDto: UpdateUserDto) {
    try {
      const { username } = req.user;
      await this.usersService.update({ username }, updateUserDto);
      const user = await this.usersService.findOne({ where: { username } });
      return this.usersService.deletePassword(user);
    } catch (err) {
      return err.message;
    }
  }

  @Post('find')
  async findMany(@Body() findUserDto: FindUserDto) {
    const { query } = findUserDto;

    const [user] = await this.usersService.findMany({
      where: [{ username: query }, { email: query }],
    });
    return this.usersService.deletePassword(user);
  }
}
