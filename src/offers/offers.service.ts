import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, FindOneOptions } from 'typeorm';
import { CreateOfferDto } from './dto/create-offer.dto';
import { Offer } from './entities/offer.entity';
import { User } from 'src/users/entities/user.entity';
import { WishesService } from 'src/wishes/wishes.service';
import { Wish } from 'src/wishes/entities/wish.entity';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offerRepository: Repository<Offer>,
    private wishesService: WishesService,
  ) {}

  async create(createOfferDto: CreateOfferDto, user: User): Promise<Offer> {
    const id = createOfferDto.itemId;
    const { amount } = createOfferDto;

    await this.wishesService.updateRaised(id, user, amount);

    delete createOfferDto.itemId;
    createOfferDto.amount = Number(createOfferDto.amount.toFixed(2));

    const offer = this.offerRepository.create(createOfferDto);
    offer.user = user;
    offer.item = { id } as Wish;
    return this.offerRepository.save(offer);
  }

  findAll(query?: FindManyOptions<Offer>): Promise<Offer[]> {
    return this.offerRepository.find(query);
  }

  findOne(query: FindOneOptions<Offer>): Promise<Offer> {
    return this.offerRepository.findOne(query);
  }
}
