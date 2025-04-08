import { Column, Entity, OneToMany } from 'typeorm';
import { PBaseEntity } from '../_base';
import { Account } from '../economy';

@Entity({ name: 'cat_account_type' })
export class AccountType extends PBaseEntity {
  @Column({ update: false })
  name: string;

  @Column()
  displayName: string;

  @Column()
  icon: string;

  //relationships
  @OneToMany(() => Account, (acc) => acc.type)
  accounts: Account[];
}
