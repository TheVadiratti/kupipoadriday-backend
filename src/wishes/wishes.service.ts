import { Injectable } from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  FindOneOptions,
  FindOptionsWhere,
  UpdateResult,
  DeleteResult,
  FindManyOptions,
} from 'typeorm';
import { Wish } from './entities/wish.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
  ) {}

  create(createWishDto: CreateWishDto, owner: User): Promise<Wish> {
    const wish = { owner, ...createWishDto };
    return this.wishRepository.save(wish);
  }

  findMany(query?: FindManyOptions<Wish>): Promise<Wish[]> {
    return this.wishRepository.find(query);
  }

  findOne(query: FindOneOptions<Wish>): Promise<Wish> {
    return this.wishRepository.findOne(query);
  }

  update(
    query: FindOptionsWhere<Wish>,
    updateWishDto: UpdateWishDto,
    copied?: number,
  ): Promise<UpdateResult> {
    return this.wishRepository.update(query, { ...updateWishDto, copied });
  }

  removeOne(query: FindOptionsWhere<Wish>): Promise<DeleteResult> {
    return this.wishRepository.delete(query);
  }
}
