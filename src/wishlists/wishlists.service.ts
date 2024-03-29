import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  DataSource,
} from 'typeorm';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { Wishlist } from './entities/wishlist.entity';
import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistRepository: Repository<Wishlist>,
    private readonly dataSource: DataSource,
  ) {}

  async create(
    createWishlistDto: CreateWishlistDto,
    user: User,
  ): Promise<Wishlist> {
    const { itemsId, ...other } = createWishlistDto;
    const wishlist = this.wishlistRepository.create({ ...other });
    wishlist.owner = user;
    if (itemsId) {
      const items = itemsId.map((id) => ({ id }));
      wishlist.items = items as Wish[];
    }
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
    user: User,
  ): Promise<Wishlist> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const wishlist = await this.findOne({
        where: query,
        relations: { owner: true },
      });

      if (wishlist.owner.username !== user.username) {
        throw new ForbiddenException(
          'Запрещено изменять чужие подборки подарков.',
        );
      }

      const { itemsId, ...other } = updateWishlistDto;
      const updatedWishlist = { ...wishlist, ...other };
      if (itemsId) {
        const items = itemsId.map((id) => ({ id }));
        updatedWishlist.items = items as Wish[];
      }

      const result = await this.wishlistRepository.save(updatedWishlist);
      await queryRunner.commitTransaction();
      return result;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async delete(
    query: FindOptionsWhere<Wishlist>,
    user: User,
  ): Promise<Wishlist> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const wishlist = await this.findOne({
        where: query,
        relations: {
          owner: true,
          items: true,
        },
      });

      if (wishlist.owner.username !== user.username) {
        throw new ForbiddenException(
          'Запрещено удалять чужие подборки подарков.',
        );
      }

      await this.wishlistRepository.delete(query);

      await queryRunner.commitTransaction();
      return wishlist;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
