import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, FindOneOptions } from 'typeorm';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { Offer } from './entities/offer.entity';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offerRepository: Repository<Offer>,
  ) {}

  async create(createOfferDto: CreateOfferDto): Promise<Offer> {
    return await this.offerRepository.save(createOfferDto);
  }

  async findSome(query?: FindManyOptions<Offer>): Promise<Offer[]> {
    return await this.offerRepository.find(query);
  }

  async findOne(query: FindOneOptions<Offer>) {
    return await this.offerRepository.findOne(query);
  }

  async updateOne(
    query: FindOneOptions<Offer>,
    updateOfferDto: UpdateOfferDto,
  ) {
    try {
      const curr = await this.offerRepository.findOne(query);
      return await this.offerRepository.update(curr.id, updateOfferDto);
    } catch (err) {
      return err.message;
    }
  }

  async removeOne(query: FindOneOptions<Offer>) {
    const curr = await this.offerRepository.findOne(query);
    return await this.offerRepository.delete(curr.id);
  }
}
