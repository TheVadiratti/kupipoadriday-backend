import { Injectable } from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wish } from './entities/wish.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishesRepository: Repository<Wish>,
  ) {}

  async create(createWishDto: CreateWishDto) {
    return this.wishesRepository.save(createWishDto);
  }

  async findAll() {
    return this.wishesRepository.find();
  }

  async findOne(id: number) {
    return this.wishesRepository.findOne({ where: { id } });
  }

  async update(id: number, updateWishDto: UpdateWishDto) {
    try {
      return this.wishesRepository.update(id, updateWishDto);
    } catch (err) {
      return err.message;
    }
  }

  async remove(id: number) {
    return this.wishesRepository.delete(id);
  }
}
