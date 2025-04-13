import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { PBaseEntity } from '../_base';
import { User } from '../user.entity';
import { Exclude } from 'class-transformer';
import { Entry } from '../economy';

@Entity()
export class EntryCategory extends PBaseEntity {
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

  @Column()
  color: string;

  @Column()
  icon: string;

  // Relación con la categoría padre (ManyToOne)
  @ManyToOne(() => EntryCategory, (category) => category.subCategories, {
    nullable: true,
    onDelete: 'SET NULL', // O 'CASCADE' según tu necesidad
  })
  @JoinColumn({ name: 'parentId' })
  parent: EntryCategory;

  @Exclude()
  @Column({ nullable: true, default: null })
  parentId?: number;

  // Relación con las subcategorías (OneToMany)
  @OneToMany(() => EntryCategory, (category) => category.parent)
  subCategories: EntryCategory[];

  @OneToMany(() => Entry, (ent) => ent.category)
  @Exclude()
  entries: Entry[];
}
