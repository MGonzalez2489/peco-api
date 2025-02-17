import { Exclude } from 'class-transformer';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { PBaseEntity } from '../_base';
import { AccountType } from '../catalogs';
import { User } from '../user.entity';
import { Entry } from './entry.entity';

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

  //
  @ManyToOne(() => AccountType, (type) => type.accounts, { eager: true })
  @JoinColumn({
    name: 'typeId',
    foreignKeyConstraintName: 'FK_Account_AccountType',
  })
  type: AccountType;

  @Exclude()
  @Column({ nullable: false })
  typeId: number;
}
