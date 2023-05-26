import { Entity, Column, ManyToMany, JoinTable, ManyToOne } from 'typeorm';
import { IsUrl, Length, MaxLength } from 'class-validator';
import { Common } from 'src/app.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import { User } from 'src/users/entities/user.entity';

@Entity()
export class Wishlist extends Common {
  @Column()
  @ManyToOne(() => User, (user) => user.wishlists)
  owner: User;

  @Column()
  @Length(1, 250)
  name: string;

  @Column()
  @MaxLength(1500)
  description: string;

  @Column()
  @IsUrl()
  image: string;

  @Column()
  @ManyToMany(() => Wish)
  @JoinTable()
  items: Wish[];
}
