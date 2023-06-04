import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  Repository,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
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

  deletePassword(user: User) {
    delete user.password;
    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    createUserDto.password = await this.getHash(createUserDto.password, 10);
    return this.userRepository.save(createUserDto);
  }

  findMany(query?: FindManyOptions<User>): Promise<User[]> {
    return this.userRepository.find(query);
  }

  findOne(query: FindOneOptions<User>): Promise<User> {
    return this.userRepository.findOne(query);
  }

  async updateOne(query: FindOptionsWhere<User>, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      updateUserDto.password = await this.getHash(updateUserDto.password, 10);
    }

    return this.userRepository.update(query, updateUserDto);
  }
}
