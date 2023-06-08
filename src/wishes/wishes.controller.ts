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
import { AuthRequest } from '../types';

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
    const wish = await this.wishesService.findOne({ where: { id } });
    const { name, link, image, price, description, copied } = wish;
    await this.wishesService.update({ id }, {}, copied + 1);
    await this.wishesService.create(
      { name, link, image, price, description },
      req.user,
    );
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
  async update(@Param('id') id: number, @Body() updateWishDto: UpdateWishDto) {
    try {
      await this.wishesService.update({ id }, updateWishDto);
    } catch (err) {
      return err.message;
    }
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  async removeOne(@Param('id') id: number) {
    const wish = await this.wishesService.findOne({
      where: { id },
      relations: {
        owner: true,
        offers: {
          user: true,
        },
      },
    });
    await this.wishesService.removeOne({ id });
    return wish;
  }
}
