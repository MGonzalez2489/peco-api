import { Exclude } from 'class-transformer';
import { BeforeInsert, Column, Entity, OneToMany } from 'typeorm';
import { PBaseEntity } from './_base';
import { Account, EntryCategory } from './economy';

@Entity()
export class User extends PBaseEntity {
  //////////Properties
  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  firstName: string;
  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  dateOfBirth: string;

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
