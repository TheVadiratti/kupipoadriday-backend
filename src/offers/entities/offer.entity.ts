import { Entity, Column, ManyToOne } from 'typeorm';
import { Common } from 'src/app.entity';
import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';

@Entity()
export class Offer extends Common {
  @ManyToOne(() => User, (user) => user.offers)
  user: User;

  @ManyToOne(() => Wish, (wish) => wish.offers)
  item: Wish;

  @Column({ type: 'decimal', scale: 2, default: 0 })
  amount: number;

  @Column({ default: false })
  hidden: boolean;
}
