import { BeforeInsert, Column, Entity, OneToMany } from 'typeorm';
import { PBaseEntity } from './_base';
import { Account } from './account.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class User extends PBaseEntity {
  @Column({ unique: true })
  email: string;

  @Column({ nullable: false })
  @Exclude()
  password: string;

  @OneToMany(() => Account, (account) => account.user)
  accounts: Account[];

  //lifecycle
  @BeforeInsert()
  format() {
    this.email = this.email.trim().toLowerCase();
  }
}
