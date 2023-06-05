import * as dotenv from 'dotenv';
import { User } from './src/users/entities/user.entity';
import { Offer } from './src/offers/entities/offer.entity';
import { Wish } from './src/wishes/entities/wish.entity';
import { Wishlist } from './src/wishlists/entities/wishlist.entity';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

const DATABASE_OPTIONS: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'student',
  password: 'student',
  database: 'kupipodariday',
  entities: [User, Offer, Wish, Wishlist],
  synchronize: true,
};

const CORS_OPTIONS: CorsOptions = {
  origin: 'http://localhost:3001',
};

export { JWT_SECRET, CORS_OPTIONS, DATABASE_OPTIONS };
