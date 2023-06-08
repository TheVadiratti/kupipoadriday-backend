import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  DeleteResult,
} from 'typeorm';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { Wishlist } from './entities/wishlist.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistRepository: Repository<Wishlist>,
  ) {}

  async create(
    createWishlistDto: CreateWishlistDto,
    user: User,
  ): Promise<Wishlist> {
    const wishlist = { ...createWishlistDto, owner: user };
    return this.wishlistRepository.save(wishlist);
  }

  findMany(query?: FindManyOptions<Wishlist>): Promise<Wishlist[]> {
    return this.wishlistRepository.find(query);
  }

  findOne(query: FindOneOptions<Wishlist>): Promise<Wishlist> {
    return this.wishlistRepository.findOne(query);
  }

  async update(
    query: FindOptionsWhere<Wishlist>,
    updateWishlistDto: UpdateWishlistDto,
  ): Promise<Wishlist> {
    const wishlist = await this.findOne({ where: query });
    const { itemsId, ...other } = updateWishlistDto;
    const items = itemsId.map((id) => ({ id }));
    const updatedWishlist = { ...wishlist, ...other, items };

    return this.wishlistRepository.save(updatedWishlist);
  }

  delete(query: FindOptionsWhere<Wishlist>): Promise<DeleteResult> {
    return this.wishlistRepository.delete(query);
  }
}
