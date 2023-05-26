import { Entity, Column, ManyToMany, JoinTable } from 'typeorm';
import { IsUrl, Length, MaxLength } from 'class-validator';
import { Common } from 'src/app.entity';
import { Wish } from 'src/wishes/entities/wish.entity';

@Entity()
export class Wishlist extends Common {
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
