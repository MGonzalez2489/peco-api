import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { PBaseEntity } from './_base';
import { User } from './user.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class Category extends PBaseEntity {
  @Column({ nullable: false })
  name: string;

  @Exclude()
  @ManyToOne(() => User, (user) => user.categories)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Exclude()
  @Column({ nullable: false })
  userId: number;

  //Parent-child
  @Column({ nullable: true })
  parentId: number;

  subCategories: Category[];
}
