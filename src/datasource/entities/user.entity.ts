import { BeforeInsert, Column, Entity, OneToMany } from 'typeorm';
import { PBaseEntity } from './_base';
import { Account } from './account.entity';

@Entity()
export class User extends PBaseEntity {
  @Column({ unique: true })
  email: string;

  @OneToMany(() => Account, (account) => account.user)
  accounts: Account[];

  //lifecycle
  @BeforeInsert()
  format() {
    this.email = this.email.trim().toLowerCase();
  }
}
