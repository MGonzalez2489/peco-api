import { Exclude } from 'class-transformer';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { PBaseEntity } from '../_base';
import { EntryType } from '../catalogs';
import { User } from '../user.entity';
import { EntryCategory } from './entry-category.entity';

@Entity()
export class PlannedEntry extends PBaseEntity {
  ///////////////////Properties
  @Column({ nullable: true })
  description: string;
  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  //planed info
  //ver si se repite o es de una sola ocacion
  @Column()
  frecuency: string;

  // es : cuando termina la frecuencia
  @Column({
    nullable: true,
  })
  frecuencyEnd: string;

  @Column()
  startDate: string;

  @Column({
    nullable: true,
  })
  recurrency: string;

  @Column({ nullable: true })
  endDate: string;

  @Column({
    default: null,
    nullable: true,
  })
  dayOfWeek: string;

  @Column({ nullable: true })
  dayOfMonth: number;

  ///////////////////Relations
  //User
  @Exclude()
  @ManyToOne(() => User, (user) => user.accounts)
  @JoinColumn({
    name: 'userId',
    foreignKeyConstraintName: 'FK_RecurrentEntry_User',
  })
  user: User;

  @Column()
  @Exclude()
  userId: number;

  //EntryType
  @ManyToOne(() => EntryType)
  @JoinColumn({
    name: 'typeId',
    foreignKeyConstraintName: 'FK_RecurrentEntry_EntryType',
  })
  type: EntryType;

  @Exclude()
  @Column({ nullable: false })
  typeId: number;

  //EntryCategory
  @ManyToOne(() => EntryCategory, (cat) => cat.subCategories)
  @JoinColumn({
    name: 'categoryId',
    foreignKeyConstraintName: 'FK_RecurrentEntry_Category',
  })
  category: EntryCategory;

  @Exclude()
  @Column({ nullable: false })
  categoryId: number;
}
