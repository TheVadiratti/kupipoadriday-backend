import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, FindOneOptions } from 'typeorm';
import { CreateOfferDto } from './dto/create-offer.dto';
import { Offer } from './entities/offer.entity';
import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offerRepository: Repository<Offer>,
  ) {}

  create(
    createOfferDto: CreateOfferDto,
    user: User,
    wish: Wish,
  ): Promise<Offer> {
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
