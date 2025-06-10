import { Exclude } from 'class-transformer';
import {
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { PBaseEntity } from '../_base';
import { AccountType } from '../catalogs';
import { User } from '../user.entity';
import { Entry } from './entry.entity';

@Entity()
export class Account extends PBaseEntity {
  @Column()
  name: string;

  @Column({
    type: 'decimal',
    precision: 10, // Define la precisión total de los dígitos
    scale: 2, // Define el número de dígitos después del punto decimal
    default: 0, // Opcional: puedes establecer un valor predeterminado
  })
  balance: number;

  @Column({
    readonly: true,
    type: 'decimal',
    precision: 10, // Define la precisión total de los dígitos
    scale: 2, // Define el número de dígitos después del punto decimal
    default: 0, // Opcional: puedes establecer un valor predeterminado
  })
  initialBalance: number;

  @Column({ readonly: true, default: false })
  isRoot: boolean;

  //temporarily unused
  @Column({ nullable: true })
  color?: string;

  @Column({ nullable: true })
  bank?: string;

  @Column({ nullable: true })
  accountNumber?: string;

  //////////Relationships

  @Exclude()
  @ManyToOne(() => User, (user) => user.accounts)
  @JoinColumn({ name: 'userId', foreignKeyConstraintName: 'FK_Account_User' })
  user: User;

  @Column()
  @Exclude()
  userId: number;

  @OneToMany(() => Entry, (entry) => entry.account)
  @Exclude()
  entries: Entry[];

  //
  @ManyToOne(() => AccountType, (type) => type.accounts, { eager: true })
  @JoinColumn({
    name: 'typeId',
    foreignKeyConstraintName: 'FK_Account_AccountType',
  })
  type: AccountType;

  @Exclude()
  @Column({ nullable: false })
  typeId: number;

  @BeforeInsert()
  @BeforeUpdate()
  dataToDatabase() {
    this.balance = this.balance * 1000;
    this.initialBalance = this.initialBalance * 1000;
  }

  @AfterLoad()
  dataToAPI() {
    this.balance = this.balance / 1000;
  }
}
