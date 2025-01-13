import { BeforeInsert, Column, Entity, OneToMany } from 'typeorm';
import { PBaseEntity } from './_base';
import { Exclude } from 'class-transformer';
import { Account } from './economy/account.entity';
import { EntryCategory } from './economy';

@Entity()
export class User extends PBaseEntity {
  //////////Properties
  @Column({ unique: true })
  email: string;

  @Column({ nullable: false })
  @Exclude()
  password: string;

  //////////Relationships
  @OneToMany(() => Account, (account) => account.user)
  @Exclude()
  accounts: Account[];

  @OneToMany(() => EntryCategory, (category) => category.user)
  @Exclude()
  categories: EntryCategory[];

  //lifecycle
  @BeforeInsert()
  format() {
    this.email = this.email.trim().toLowerCase();
  }
}
