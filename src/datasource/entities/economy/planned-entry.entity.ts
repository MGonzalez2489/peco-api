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
  // @Column({
  //   type: 'enum',
  //   enum: PlannedEntryFrecuencyEnum,
  //   default: PlannedEntryFrecuencyEnum.ONE_TIME,
  // })
  // frecuency: PlannedEntryFrecuencyEnum;

  //es : cuando termina la frecuencia
  // @Column({
  //   type: 'enum',
  //   enum: PlannedEntryFrecuencyEndEnum,
  //   default: null,
  //   nullable: true,
  // })
  // frecuencyEnd: PlannedEntryFrecuencyEnum;

  @Column()
  startDate: string;

  // @Column({
  //   type: 'enum',
  //   enum: PlannedEntryRecurrencyEnum,
  //   default: null,
  //   nullable: true,
  // })
  // recurrency: PlannedEntryRecurrencyEnum;

  @Column({ nullable: true })
  endDate: string;

  // @Column({
  //   type: 'enum',
  //   enum: DaysOfWeekEnum,
  //   default: null,
  //   nullable: true,
  // })
  // dayOfWeek: DaysOfWeekEnum;

  // @Column({ nullable: true })
  // dayOfMonth: number;

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
