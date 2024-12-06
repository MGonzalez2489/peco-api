import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { PBaseEntity } from './_base';
import { User } from './user.entity';
import { Exclude } from 'class-transformer';
import { Entry } from './entry.entity';

@Entity()
export class Account extends PBaseEntity {
  @Column()
  name: string;

  @Exclude()
  @ManyToOne(() => User, (user) => user.accounts)
  user: User;

  @OneToMany(() => Entry, (entry) => entry.account)
  entries: Entry[];
}
