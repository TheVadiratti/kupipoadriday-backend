import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  Param,
  UseGuards,
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { AuthRequest } from '../types';
import { JwtGuard } from '../auth/auth.guard';
import { WishesService } from '../wishes/wishes.service';

@Controller('offers')
@UseGuards(JwtGuard)
export class OffersController {
  constructor(
    private readonly offersService: OffersService,
    private readonly wishesService: WishesService,
  ) {}

  @Post()
  async create(
    @Body() createOfferDto: CreateOfferDto,
    @Req() req: AuthRequest,
  ) {
    const wish = await this.wishesService.findOne({
      where: { id: createOfferDto.itemId },
    });
    await this.offersService.create(createOfferDto, req.user, wish);
  }

  @Get()
  async findAll() {
    return await this.offersService.findAll({
      relations: {
        item: true,
        user: true,
      },
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.offersService.findOne({
      where: { id },
      relations: {
        item: true,
        user: true,
      },
    });
  }
}
