import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { PBaseEntity } from './_base';
import { User } from './user.entity';
import { Exclude } from 'class-transformer';
import { Entry } from './entry.entity';

@Entity()
export class Account extends PBaseEntity {
  @Column()
  name: string;

  @Column('double', { precision: 10, scale: 2 })
  balance: number;

  @Column({ default: false })
  isDefault: boolean;

  @Exclude()
  @ManyToOne(() => User, (user) => user.accounts)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  @Exclude()
  userId: number;

  @OneToMany(() => Entry, (entry) => entry.account)
  @Exclude()
  entries: Entry[];
}
