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
} from 'typeorm';
import { Wish } from './entities/wish.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
  ) {}

  create(createWishDto: CreateWishDto): Promise<Wish> {
    return this.wishRepository.save(createWishDto);
  }

  findOne(query: FindOneOptions<Wish>): Promise<Wish> {
    return this.wishRepository.findOne(query);
  }

  update(
    query: FindOptionsWhere<Wish>,
    updateWishDto: UpdateWishDto,
  ): Promise<UpdateResult> {
    return this.wishRepository.update(query, updateWishDto);
  }

  removeOne(query: FindOptionsWhere<Wish>): Promise<DeleteResult> {
    return this.wishRepository.delete(query);
  }
}
