import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, FindOneOptions } from 'typeorm';
import { CreateOfferDto } from './dto/create-offer.dto';
import { Offer } from './entities/offer.entity';
import { User } from 'src/users/entities/user.entity';
import { WishesService } from 'src/wishes/wishes.service';
import { getReised } from './offers.helper';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offerRepository: Repository<Offer>,
    private wishesService: WishesService,
  ) {}

  async create(createOfferDto: CreateOfferDto, user: User): Promise<Offer> {
    const id = createOfferDto.itemId;
    const wish = await this.wishesService.findOne({
      where: { id },
    });
    wish.reised = getReised(Number(wish.reised), createOfferDto.amount);
    await this.wishesService.update({ id }, wish);
    delete createOfferDto.itemId;
    const offer = { user, item: wish, ...createOfferDto };
    return this.offerRepository.save(offer);
  }

  findAll(query?: FindManyOptions<Offer>): Promise<Offer[]> {
    return this.offerRepository.find(query);
  }

  findOne(query: FindOneOptions<Offer>): Promise<Offer> {
    return this.offerRepository.findOne(query);
  }
}
