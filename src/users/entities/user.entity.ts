import { Entity, Column, OneToMany } from 'typeorm';
import { Length, IsNotEmpty, IsEmail } from 'class-validator';
import { Common } from 'src/app.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import { Offer } from 'src/offers/entities/offer.entity';
import { Wishlist } from 'src/wishlists/entities/wishlist.entity';
import { Exclude, Expose } from 'class-transformer';

@Entity()
export class User extends Common {
  @Column({ unique: true })
  @Length(1, 64)
  username: string;

  @Column({ default: 'Пока ничего не рассказал о себе' })
  @Length(1, 200)
  about: string;

  @Column({ default: 'https://i.pravatar.cc/300' })
  avatar: string;

  @Column({ unique: true })
  @IsEmail()
  @Expose({ groups: ['owner'] })
  email: string;

  @Column()
  @IsNotEmpty()
  @Exclude()
  password: string;

  @OneToMany(() => Wish, (wish) => wish.owner)
  wishes: Wish[];

  @OneToMany(() => Offer, (offer) => offer.user)
  offers: Offer[];

  @OneToMany(() => Wishlist, (wishlist) => wishlist.owner)
  wishlists: Wishlist[];
}
