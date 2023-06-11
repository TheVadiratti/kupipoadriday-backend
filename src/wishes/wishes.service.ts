import {
  ForbiddenException,
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  FindOneOptions,
  FindOptionsWhere,
  UpdateResult,
  FindManyOptions,
} from 'typeorm';
import { Wish } from './entities/wish.entity';
import { User } from '../users/entities/user.entity';
import { getReised } from './wishes.helper';

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

  async update(
    query: FindOptionsWhere<Wish>,
    updateWishDto: UpdateWishDto,
    user: User,
  ): Promise<UpdateResult> {
    const wish = await this.findOne({
      where: query,
      relations: { owner: true },
    });

    if (wish.owner.username !== user.username) {
      throw new ForbiddenException('Запрещено менять чужие хотелки.');
    }

    if (updateWishDto.price && wish.raised > 0) {
      throw new ForbiddenException(
        'Запрещено менять стоимость подарка, если уже есть скинувшиеся.',
      );
    }

    return this.wishRepository.update(query, updateWishDto);
  }

  async updateRaised(
    id: number,
    user: User,
    amount: number,
  ): Promise<UpdateResult> {
    const wish = await this.findOne({
      where: { id },
      relations: { owner: true },
    });

    if (user.username === wish.owner.username) {
      throw new ForbiddenException('Нельзя скидываться на подарок себе.');
    }

    const newRaised = getReised(Number(wish.raised), amount);
    if (wish.price < newRaised) {
      throw new BadRequestException(
        'Сумма собранных средств не может превышать стоимость подарка.',
      );
    }

    return this.wishRepository.update({ id }, { raised: newRaised });
  }

  async makeCopy(id: number, user: User): Promise<Wish> {
    const wish = await this.findOne({ where: { id } });
    const { name, link, image, price, description, copied } = wish;
    await this.wishRepository.update({ id }, { copied: copied + 1 });
    return this.create({ name, link, image, price, description }, user);
  }

  async removeOne(query: FindOptionsWhere<Wish>, user: User): Promise<Wish> {
    const wish = await this.findOne({
      where: query,
      relations: {
        owner: true,
        offers: {
          user: true,
        },
      },
    });

    if (wish.owner.username !== user.username) {
      throw new ForbiddenException('Нельзя удалять чужие хотелки.');
    }

    await this.wishRepository.delete(query);

    return wish;
  }
}
