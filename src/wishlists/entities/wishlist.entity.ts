import { Entity, Column, ManyToMany, JoinTable, ManyToOne } from 'typeorm';
import { IsNotEmpty, IsOptional, IsUrl, MaxLength } from 'class-validator';
import { Common } from 'src/app.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import { User } from 'src/users/entities/user.entity';

@Entity()
export class Wishlist extends Common {
  @ManyToOne(() => User, (user) => user.wishlists)
  owner: User;

  @Column()
  @IsNotEmpty()
  @MaxLength(250)
  name: string;

  @Column()
  @MaxLength(1500)
  description: string;

  @Column()
  @IsUrl()
  image: string;

  @ManyToMany(() => Wish)
  @JoinTable()
  @IsOptional()
  items: Wish[];
}
