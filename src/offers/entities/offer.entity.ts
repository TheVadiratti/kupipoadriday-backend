import { Entity, Column, ManyToOne } from 'typeorm';
import { Common } from 'src/app.entity';
import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';

@Entity()
export class Offer extends Common {
  @Column()
  @ManyToOne(() => User, (user) => user.offers)
  user: User;

  @Column()
  @ManyToOne(() => Wish, (wish) => wish.offers)
  item: Wish;

  @Column({ type: 'decimal', scale: 2 })
  amount: number;

  @Column({ default: false })
  hidden: boolean;
}
