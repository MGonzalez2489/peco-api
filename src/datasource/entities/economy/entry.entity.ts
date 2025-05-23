import { Exclude } from 'class-transformer';
import {
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { PBaseEntity } from '../_base';
import { EntryStatus, EntryType } from '../catalogs';
import { Account } from './account.entity';
import { EntryCategory } from './entry-category.entity';

@Entity()
export class Entry extends PBaseEntity {
  //columns
  @Column()
  amount: number;

  @Column()
  prevBalance: number;

  @Column()
  description: string;

  //////////Relationships
  @ManyToOne(() => EntryType, { eager: true })
  @JoinColumn({
    name: 'typeId',
    foreignKeyConstraintName: 'FK_Entry_EntryType',
  })
  type: EntryType;

  @Exclude()
  @Column({ nullable: false })
  typeId: number;

  @ManyToOne(() => EntryStatus, { eager: true })
  @JoinColumn({
    name: 'statusId',
    foreignKeyConstraintName: 'FK_Entry_EntryStatus',
  })
  status: EntryStatus;

  @Exclude()
  @Column({ nullable: false })
  statusId: number;

  //Categories
  @ManyToOne(() => EntryCategory, (cat) => cat.subCategories, { eager: true })
  @JoinColumn({
    name: 'categoryId',
    foreignKeyConstraintName: 'FK_Entry_Category',
  })
  category: EntryCategory;

  @Exclude()
  @Column({ nullable: false })
  categoryId: number;
  //Accounts
  @ManyToOne(() => Account, (account) => account.entries, { eager: true })
  @JoinColumn({
    name: 'accountId',
    foreignKeyConstraintName: 'FK_Entry_Account',
  })
  account: Account;

  @Column()
  @Exclude()
  accountId: number;

  @BeforeInsert()
  updateBalanceToDBInsert() {
    this.amount *= 1000;
  }

  @BeforeUpdate()
  updateBalanceToDb() {
    this.amount *= 1000;
  }

  @AfterLoad()
  updateBalanceToAPI() {
    this.amount = this.amount / 1000;
    this.prevBalance = this.prevBalance / 1000;
  }
}
