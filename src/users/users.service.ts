import { Injectable, ConflictException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  Repository,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  UpdateResult,
  QueryFailedError,
} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { userAlreadyExist } from '../utils/constants';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  getHash(password: string, saltOrRounds: string | number) {
    return bcrypt.hash(password, saltOrRounds);
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const user = this.userRepository.create(createUserDto);
      user.password = await this.getHash(createUserDto.password, 10);
      await this.userRepository.save(user);
      return this.findOne({
        where: { username: createUserDto.username },
      });
    } catch (err) {
      if (err instanceof QueryFailedError) {
        if (err.driverError.code === '23505') {
          throw new ConflictException(userAlreadyExist);
        }
      }
    }
  }

  findMany(query?: FindManyOptions<User>): Promise<User[]> {
    return this.userRepository.find(query);
  }

  findOne(query: FindOneOptions<User>): Promise<User> {
    return this.userRepository.findOne(query);
  }

  async update(
    query: FindOptionsWhere<User>,
    updateUserDto: UpdateUserDto,
  ): Promise<UpdateResult> {
    if (updateUserDto.password) {
      updateUserDto.password = await this.getHash(updateUserDto.password, 10);
    }

    return this.userRepository.update(query, updateUserDto);
  }
}
