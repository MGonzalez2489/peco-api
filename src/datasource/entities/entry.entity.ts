import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { PBaseEntity } from './_base';
import { EntryTypeEnum } from 'src/common/enums';
import { Account } from './account.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class Entry extends PBaseEntity {
  //columns
  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;
  @Column()
  description: string;

  @Column({ type: 'enum', enum: EntryTypeEnum, nullable: false })
  type: EntryTypeEnum;

  //////////Relationships
  //Categories

  //Accounts
  @ManyToOne(() => Account, (account) => account.entries)
  @Exclude()
  @JoinColumn({ name: 'accountId' })
  account: Account;

  @Column()
  @Exclude()
  accountId: number;
}
