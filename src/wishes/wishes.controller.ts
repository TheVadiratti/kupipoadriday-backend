import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Req,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { JwtGuard } from '../auth/auth.guard';
import { AuthRequest } from '../utils/types';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @Post()
  @UseGuards(JwtGuard)
  async create(@Req() req: AuthRequest, @Body() createWishDto: CreateWishDto) {
    return await this.wishesService.create(createWishDto, req.user);
  }

  @Get('last')
  async findLast() {
    return await this.wishesService.findMany({
      relations: {
        owner: true,
        offers: {
          user: true,
        },
      },
      order: {
        createAt: 'DESC',
      },
      take: 40,
    });
  }

  @Get('top')
  async findTop() {
    return await this.wishesService.findMany({
      relations: {
        owner: true,
        offers: {
          user: true,
        },
      },
      order: {
        copied: 'DESC',
      },
      take: 20,
    });
  }

  @Post(':id/copy')
  @UseGuards(JwtGuard)
  async copyWish(@Param('id') id: number, @Req() req: AuthRequest) {
    return await this.wishesService.makeCopy(id, req.user);
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  async findOne(@Param('id') id: number) {
    return await this.wishesService.findOne({
      where: { id },
      relations: {
        owner: true,
        offers: {
          user: true,
        },
      },
    });
  }

  @Patch(':id')
  @UseGuards(JwtGuard)
  async update(
    @Param('id') id: number,
    @Req() req: AuthRequest,
    @Body() updateWishDto: UpdateWishDto,
  ) {
    await this.wishesService.update({ id }, updateWishDto, req.user);
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  async removeOne(@Param('id') id: number, @Req() req: AuthRequest) {
    return await this.wishesService.removeOne({ id }, req.user);
  }
}
