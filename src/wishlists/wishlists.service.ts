import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, FindOneOptions } from 'typeorm';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { Wishlist } from './entities/wishlist.entity';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistRepository: Repository<Wishlist>,
  ) {}

  async create(createWishlistDto: CreateWishlistDto): Promise<Wishlist> {
    return await this.wishlistRepository.save(createWishlistDto);
  }

  async findSome(query?: FindManyOptions<Wishlist>): Promise<Wishlist[]> {
    return await this.wishlistRepository.find(query);
  }

  async findOne(query: FindOneOptions<Wishlist>) {
    return await this.wishlistRepository.findOne(query);
  }

  async updateOne(
    query: FindOneOptions<Wishlist>,
    updateWishlistDto: UpdateWishlistDto,
  ) {
    try {
      const curr = await this.wishlistRepository.findOne(query);
      return await this.wishlistRepository.update(curr.id, updateWishlistDto);
    } catch (err) {
      return err.message;
    }
  }

  async removeOne(query: FindOneOptions<Wishlist>) {
    const curr = await this.wishlistRepository.findOne(query);
    return await this.wishlistRepository.delete(curr.id);
  }
}
