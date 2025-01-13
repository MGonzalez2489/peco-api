import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Account } from './account.entity';
import { Exclude } from 'class-transformer';
import { PBaseEntity } from '../_base';
import { EntryType } from '../catalogs';
import { EntryCategory } from './entry-category.entity';

@Entity()
export class Entry extends PBaseEntity {
  //columns
  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;
  @Column()
  description: string;

  //////////Relationships
  @ManyToOne(() => EntryType)
  @JoinColumn({
    name: 'typeId',
    foreignKeyConstraintName: 'FK_Entry_EntryType',
  })
  type: EntryType;

  @Exclude()
  @Column({ nullable: false })
  typeId: number;

  //Categories
  @ManyToOne(() => EntryCategory, (cat) => cat.subCategories)
  @JoinColumn({
    name: 'categoryId',
    foreignKeyConstraintName: 'FK_Entry_Category',
  })
  category: EntryCategory;

  @Exclude()
  @Column({ nullable: false })
  categoryId: number;
  //Accounts
  @ManyToOne(() => Account, (account) => account.entries)
  @JoinColumn({
    name: 'accountId',
    foreignKeyConstraintName: 'FK_Entry_Account',
  })
  account: Account;

  @Column()
  @Exclude()
  accountId: number;
}
