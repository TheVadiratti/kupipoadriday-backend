import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  UseGuards,
  Req,
  Param,
  SerializeOptions,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindUserDto } from './dto/find-users.dto';
import { JwtGuard } from '../auth/auth.guard';
import { AuthRequest } from '../utils/types';

@Controller('users')
@UseGuards(JwtGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @SerializeOptions({ groups: ['owner'] })
  async findOwn(@Req() req: AuthRequest) {
    return await this.usersService.findOne({
      where: { username: req.user.username },
    });
  }

  @Get(':username')
  async findOne(@Param('username') username: string) {
    return await this.usersService.findOne({ where: { username } });
  }

  @Patch('me')
  @SerializeOptions({ groups: ['owner'] })
  async update(@Req() req: AuthRequest, @Body() updateUserDto: UpdateUserDto) {
    try {
      const { username } = req.user;
      await this.usersService.update({ username }, updateUserDto);
      return await this.usersService.findOne({ where: { username } });
    } catch (err) {
      return err.message;
    }
  }

  @Post('find')
  @SerializeOptions({ groups: ['owner'] })
  async findMany(@Body() findUserDto: FindUserDto) {
    const { query } = findUserDto;

    const user = await this.usersService.findMany({
      where: [{ username: query }, { email: query }],
    });
    return user;
  }

  @Get('me/wishes')
  async getOwnWishes(@Req() req: AuthRequest) {
    const user = await this.usersService.findOne({
      where: { username: req.user.username },
      relations: {
        wishes: true,
      },
    });
    return user.wishes;
  }

  @Get(':username/wishes')
  async getWishes(@Param('username') username: string) {
    const user = await this.usersService.findOne({
      where: { username },
      relations: {
        wishes: true,
      },
    });
    return user.wishes;
  }
}
