import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository, FindManyOptions, FindOneOptions } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    return await this.userRepository.save(createUserDto);
  }

  async findSome(query?: FindManyOptions<User>): Promise<User[]> {
    return await this.userRepository.find(query);
  }

  async findOne(query: FindOneOptions<User>) {
    return await this.userRepository.findOne(query);
  }

  async updateOne(query: FindOneOptions<User>, updateUserDto: UpdateUserDto) {
    try {
      const curr = await this.userRepository.findOne(query);
      return await this.userRepository.update(curr.id, updateUserDto);
    } catch (err) {
      return err.message;
    }
  }

  async removeOne(query: FindOneOptions<User>) {
    const curr = await this.userRepository.findOne(query);
    return await this.userRepository.delete(curr.id);
  }
}
