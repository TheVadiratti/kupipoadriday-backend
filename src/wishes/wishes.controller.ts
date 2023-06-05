import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @Post()
  async create(@Body() createWishDto: CreateWishDto) {
    return await this.wishesService.create(createWishDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.wishesService.findOne({ where: { id } });
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateWishDto: UpdateWishDto) {
    try {
      await this.wishesService.update({ id }, updateWishDto);
    } catch (err) {
      return err.message;
    }
  }

  @Delete(':id')
  async removeOne(@Param('id') id: number) {
    const wish = await this.wishesService.findOne({ where: { id } });
    await this.wishesService.removeOne({ id });
    return wish;
  }
}
