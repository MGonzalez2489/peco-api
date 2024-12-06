import { Column, Entity, ManyToOne } from 'typeorm';
import { PBaseEntity } from './_base';
import { EntryTypeEnum } from 'src/common/enums';
import { Account } from './account.entity';

@Entity()
export class Entry extends PBaseEntity {
  //columns
  @Column({ nullable: false })
  amount: number;
  @Column()
  description: string;

  @Column({ type: 'enum', enum: EntryTypeEnum, nullable: false })
  type: EntryTypeEnum;
  //relations

  @ManyToOne(() => Account, (account) => account.entries)
  account: Account;
}
