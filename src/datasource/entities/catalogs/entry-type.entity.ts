import { Exclude } from 'class-transformer';
import { Column, Entity, Generated, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'CatEntryType' })
export class CatEntryType {
  @Exclude()
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, update: false })
  @Generated('uuid')
  publicId: string;

  @Column({ update: false })
  name: string;

  @Column()
  displayName: string;
}
