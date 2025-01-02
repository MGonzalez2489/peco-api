import { Column, Entity } from 'typeorm';
import { PBaseEntity } from './_base';

@Entity()
export class Category extends PBaseEntity {
  @Column({ nullable: false })
  name: string;

  subCategories: Category[];
}
