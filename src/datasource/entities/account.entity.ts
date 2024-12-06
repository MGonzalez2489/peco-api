import { Column, Entity, ManyToOne } from 'typeorm';
import { PBaseEntity } from './_base';
import { User } from './user.entity';

@Entity()
export class Account extends PBaseEntity {
  @Column()
  name: string;

  @ManyToOne(() => User, (user) => user.accounts)
  user: User;
}
