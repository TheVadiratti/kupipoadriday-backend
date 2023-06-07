import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Req,
  Param,
  UseGuards,
} from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { AuthRequest } from '../types';
import { JwtGuard } from '../auth/auth.guard';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';

@Controller('wishlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @UseGuards(JwtGuard)
  @Post()
  async create(
    @Body() createWishlistDto: CreateWishlistDto,
    @Req() req: AuthRequest,
  ) {
    return await this.wishlistsService.create(createWishlistDto, req.user);
  }

  @Get()
  async findAll() {
    return await this.wishlistsService.findMany({ relations: { owner: true } });
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.wishlistsService.findOne({
      where: { id },
      relations: {
        owner: true,
      },
    });
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateWishlistDto: UpdateWishlistDto,
  ) {
    try {
      await this.wishlistsService.update({ id }, updateWishlistDto);
      return await this.wishlistsService.findOne({ where: { id } });
    } catch (err) {
      return err.message;
    }
  }

  @Delete(':id')
  async removeOne(@Param('id') id: number) {
    const wishlist = this.wishlistsService.findOne({ where: { id } });
    await this.wishlistsService.delete({ id });
    return wishlist;
  }
}
