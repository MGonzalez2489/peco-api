import { Exclude } from 'class-transformer';
import {
  AfterLoad,
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { PBaseEntity } from '../_base';
import { AccountType } from '../catalogs';
import { User } from '../user.entity';
import { Entry } from './entry.entity';

@Entity()
export class Account extends PBaseEntity {
  @Column()
  name: string;

  @Column()
  balance: number;

  @Column({ readonly: true })
  initialBalance: number;

  @Column({ readonly: true, default: false })
  isRoot: boolean;

  @Column({ nullable: true })
  color?: string;

  @Column({ nullable: true })
  bank?: string;

  @Column({ nullable: true })
  accountNumber?: string;

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

  @BeforeInsert()
  updateBalanceToDBInsert() {
    this.balance = this.balance * 1000;
    this.initialBalance = this.initialBalance * 1000;
  }

  @AfterLoad()
  updateBalanceToAPI() {
    this.balance = this.balance / 1000; // Dividir y asegurar 3 decimales
  }
}
