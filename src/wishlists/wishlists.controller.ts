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
import { AuthRequest } from '../utils/types';
import { JwtGuard } from '../auth/auth.guard';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';

@Controller('wishlists')
@UseGuards(JwtGuard)
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Post()
  async create(
    @Body() createWishlistDto: CreateWishlistDto,
    @Req() req: AuthRequest,
  ) {
    return await this.wishlistsService.create(createWishlistDto, req.user);
  }

  @Get()
  async findAll() {
    return await this.wishlistsService.findMany({
      relations: {
        owner: true,
        items: true,
      },
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.wishlistsService.findOne({
      where: { id },
      relations: {
        owner: true,
        items: true,
      },
    });
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Req() req: AuthRequest,
    @Body() updateWishlistDto: UpdateWishlistDto,
  ) {
    return await this.wishlistsService.update(
      { id },
      updateWishlistDto,
      req.user,
    );
  }

  @Delete(':id')
  async removeOne(@Param('id') id: number, @Req() req: AuthRequest) {
    return await this.wishlistsService.delete({ id }, req.user);
  }
}
