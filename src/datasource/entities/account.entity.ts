import { Column, Entity, ManyToOne } from 'typeorm';
import { PBaseEntity } from './_base';
import { User } from './user.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class Account extends PBaseEntity {
  @Column()
  name: string;

  @Exclude()
  @ManyToOne(() => User, (user) => user.accounts)
  user: User;
}
