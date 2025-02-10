import { Column, Entity } from 'typeorm';
import { PBaseEntity } from '../_base';

@Entity()
export class AccountType extends PBaseEntity {
  @Column({ update: false })
  name: string;

  @Column()
  displayName: string;
}
