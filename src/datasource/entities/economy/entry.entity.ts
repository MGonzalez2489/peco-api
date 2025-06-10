import { Exclude } from 'class-transformer';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { PBaseEntity } from '../_base';
import { EntryStatus, EntryType } from '../catalogs';
import { Account } from './account.entity';
import { EntryCategory } from './entry-category.entity';

@Entity()
export class Entry extends PBaseEntity {
  //columns
  @Column({
    type: 'decimal',
    precision: 10, // Define la precisión total de los dígitos
    scale: 2, // Define el número de dígitos después del punto decimal
    default: 0, // Opcional: puedes establecer un valor predeterminado
  })
  amount: number;

  @Column({
    type: 'decimal',
    precision: 10, // Define la precisión total de los dígitos
    scale: 2, // Define el número de dígitos después del punto decimal
    default: 0, // Opcional: puedes establecer un valor predeterminado})
  })
  prevAccBalance: number;

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
}
