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
  DataSource,
} from 'typeorm';
import { Wish } from './entities/wish.entity';
import { User } from '../users/entities/user.entity';
import { getReised } from './wishes.helper';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
    private dataSource: DataSource,
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
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
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

      const updatedWish = await this.wishRepository.update(
        query,
        updateWishDto,
      );
      await queryRunner.commitTransaction();
      return updatedWish;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async updateRaised(
    id: number,
    user: User,
    amount: number,
  ): Promise<UpdateResult> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
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

      const updatedWish = await this.wishRepository.update(
        { id },
        { raised: newRaised },
      );

      await queryRunner.commitTransaction();
      return updatedWish;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async makeCopy(id: number, user: User): Promise<Wish> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const wish = await this.findOne({ where: { id } });
      const { name, link, image, price, description, copied } = wish;
      await this.wishRepository.update({ id }, { copied: copied + 1 });
      const copy = await this.create(
        { name, link, image, price, description },
        user,
      );

      await queryRunner.commitTransaction();
      return copy;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async removeOne(query: FindOptionsWhere<Wish>, user: User): Promise<Wish> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
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

      await queryRunner.commitTransaction();
      return wish;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
