import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { PBaseEntity } from './_base';
import { Account } from './account.entity';
import { Exclude } from 'class-transformer';
import { Category } from './category.entity';
import { CatEntryType } from './catalogs';

@Entity()
export class Entry extends PBaseEntity {
  //columns
  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;
  @Column()
  description: string;

  //////////Relationships
  @ManyToOne(() => CatEntryType)
  @JoinColumn({
    name: 'typeId',
    foreignKeyConstraintName: 'FK_Entry_EntryType',
  })
  type: CatEntryType;

  @Exclude()
  @Column({ nullable: false })
  typeId: number;

  //Categories
  @ManyToOne(() => Category, (cat) => cat.subCategories)
  @JoinColumn({
    name: 'categoryId',
    foreignKeyConstraintName: 'FK_Entry_Category',
  })
  category: Category;

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
