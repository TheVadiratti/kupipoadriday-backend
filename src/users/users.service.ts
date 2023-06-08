import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  Repository,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  UpdateResult,
} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

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
    createUserDto.password = await this.getHash(createUserDto.password, 10);
    await this.userRepository.save(createUserDto);
    return this.findOne({
      where: { username: createUserDto.username },
    });
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
