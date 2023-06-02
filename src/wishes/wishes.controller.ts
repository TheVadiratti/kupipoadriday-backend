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
  create(@Body() createWishDto: CreateWishDto) {
    return this.wishesService.create(createWishDto);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.wishesService.findOne({ where: { id } });
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateWishDto: UpdateWishDto) {
    return this.wishesService.updateOne({ where: { id } }, updateWishDto);
  }

  @Delete('id')
  removeOne(@Param('id') id: number) {
    return this.wishesService.removeOne({ where: { id } });
  }
}
