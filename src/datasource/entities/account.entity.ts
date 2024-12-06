import { Column, Entity } from 'typeorm';
import { PBaseEntity } from './_base';

@Entity()
export class Account extends PBaseEntity {
  @Column()
  name: string;
}
