import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository, FindManyOptions, FindOneOptions } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getHash(password: string, saltOrRounds: string | number) {
    return await bcrypt.hash(password, saltOrRounds);
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    createUserDto.password = await this.getHash(createUserDto.password, 10);
    return this.userRepository.save(createUserDto);
  }

  async findSome(query?: FindManyOptions<User>): Promise<User[]> {
    return await this.userRepository.find(query);
  }

  async findOne(query: FindOneOptions<User>) {
    return await this.userRepository.findOne(query);
  }

  async updateOne(query: FindOneOptions<User>, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      updateUserDto.password = await this.getHash(updateUserDto.password, 10);
    }

    try {
      const user = await this.userRepository.findOne(query);
      return await this.userRepository.update(user.id, updateUserDto);
    } catch (err) {
      return err.message;
    }
  }

  async removeOne(query: FindOneOptions<User>) {
    const user = await this.userRepository.findOne(query);
    return await this.userRepository.delete(user.id);
  }
}
