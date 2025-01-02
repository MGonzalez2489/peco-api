import { BeforeInsert, Column, Entity, OneToMany } from 'typeorm';
import { PBaseEntity } from './_base';
import { Account } from './account.entity';
import { Exclude } from 'class-transformer';
import { Category } from './category.entity';

@Entity()
export class User extends PBaseEntity {
  @Column({ unique: true })
  email: string;

  @Column({ nullable: false })
  @Exclude()
  password: string;

  //////////Relationships
  @OneToMany(() => Account, (account) => account.user)
  @Exclude()
  accounts: Account[];

  @OneToMany(() => Category, (category) => category.user)
  categories: Category[];

  //lifecycle
  @BeforeInsert()
  format() {
    this.email = this.email.trim().toLowerCase();
  }
}
