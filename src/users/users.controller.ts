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
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindUserDto } from './dto/find-users.dto';
import { JwtGuard } from '../auth/auth.guard';
import { AuthRequest } from '../types';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @UseGuards(JwtGuard)
  @Get('me')
  findOwn(@Req() req: AuthRequest) {
    return this.usersService.findOne({
      where: { username: req.user.username },
    });
  }

  @UseGuards(JwtGuard)
  @Get(':username')
  findOne(@Param('username') username: string) {
    return this.usersService.findOne({ where: { username } });
  }

  @UseGuards(JwtGuard)
  @Patch('me')
  update(@Req() req: AuthRequest, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateOne(
      {
        where: { username: req.user.username },
      },
      updateUserDto,
    );
  }

  @UseGuards(JwtGuard)
  @Post('find')
  findMany(@Body() findUserDto: FindUserDto) {
    const { query } = findUserDto;

    return this.usersService.findMany({
      where: [{ username: query }, { email: query }],
    });
  }
}
