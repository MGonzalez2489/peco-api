import { Column, Entity } from 'typeorm';
import { PBaseEntity } from '../_base';

@Entity({ name: 'cat_entry_type' })
export class EntryType extends PBaseEntity {
  @Column({ update: false })
  name: string;

  @Column()
  displayName: string;

  @Column()
  color: string;
}
