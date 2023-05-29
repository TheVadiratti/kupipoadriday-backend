import { Injectable } from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, FindOneOptions } from 'typeorm';
import { Wish } from './entities/wish.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
  ) {}

  async create(createWishDto: CreateWishDto): Promise<Wish> {
    return await this.wishRepository.save(createWishDto);
  }

  async findSome(query?: FindManyOptions<Wish>): Promise<Wish[]> {
    return await this.wishRepository.find(query);
  }

  async findOne(query: FindOneOptions<Wish>) {
    return await this.wishRepository.findOne(query);
  }

  async updateOne(query: FindOneOptions<Wish>, updateWishDto: UpdateWishDto) {
    try {
      const curr = await this.wishRepository.findOne(query);
      return await this.wishRepository.update(curr.id, updateWishDto);
    } catch (err) {
      return err.message;
    }
  }

  async removeOne(query: FindOneOptions<Wish>) {
    const curr = await this.wishRepository.findOne(query);
    return await this.wishRepository.delete(curr.id);
  }
}
