import { Exclude } from 'class-transformer';
import { AfterLoad, BeforeInsert, Column, Entity, OneToMany } from 'typeorm';
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

  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: true })
  avatarFullPath: string;

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

  //TODO: View if 'assets/uploads' may come from config service
  //if not, this formatter function needs to be moved out of the entity
  //Arreglar este after load to map server address and avatar address
  @AfterLoad()
  avatarFormat() {
    this.avatar =
      this.avatar !== null ? `${global.appUrl}/assets/${this.avatar}` : '';
  }
}
