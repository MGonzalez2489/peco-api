import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { PBaseEntity } from './_base';
import { User } from './user.entity';
import { Exclude } from 'class-transformer';
import { Entry } from './entry.entity';

@Entity()
export class Category extends PBaseEntity {
  @Column({ nullable: false })
  name: string;

  @Column({ default: true })
  isVisible: boolean;

  @Column({ default: false })
  isDefault: boolean;

  //////////Relationships
  @Exclude()
  @ManyToOne(() => User, (user) => user.categories)
  @JoinColumn({ name: 'userId', foreignKeyConstraintName: 'FK_Category_User' })
  user: User;

  @Exclude()
  @Column()
  userId: number;

  //Parent-child
  @Exclude()
  @Column({ nullable: true, default: null })
  parentId?: number;

  @ManyToOne(() => Category, (cat) => cat.subCategories)
  @JoinColumn({
    name: 'parentId',
    foreignKeyConstraintName: 'FK_Category_Category',
  })
  subCategories: Category[];

  @OneToMany(() => Entry, (ent) => ent.category)
  @Exclude()
  entries: Entry[];
}
