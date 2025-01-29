import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Entry } from './entry.entity';
import { PBaseEntity } from '../_base';
import { User } from '../user.entity';

@Entity()
export class Account extends PBaseEntity {
  @Column()
  name: string;

  @Column('double', { precision: 10, scale: 2 })
  balance: number;

  @Column({ readonly: true })
  initialBalance: number;

  @Column({ default: false })
  isDefault: boolean;

  @Column({ readonly: true, default: true })
  isRoot: boolean;

  //////////Relationships

  @Exclude()
  @ManyToOne(() => User, (user) => user.accounts)
  @JoinColumn({ name: 'userId', foreignKeyConstraintName: 'FK_Account_User' })
  user: User;

  @Column()
  @Exclude()
  userId: number;

  @OneToMany(() => Entry, (entry) => entry.account)
  @Exclude()
  entries: Entry[];
}
