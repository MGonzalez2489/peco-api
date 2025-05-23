import { Column, Entity } from 'typeorm';
import { PBaseEntity } from '../_base';

@Entity({ name: 'cat_entry_status' })
export class EntryStatus extends PBaseEntity {
  @Column({ update: false })
  name: string;

  @Column()
  displayName: string;
}
