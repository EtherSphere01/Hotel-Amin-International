import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Accommodation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  category: string;

  @Column('text')
  description: string;

  @Column('text')
  title: string;

  @Column()
  price: number;

  @Column()
  max_adults: string;

  @Column('text', { array: true, nullable: true })
  specs: string[];

  @Column('text', { array: true, nullable: true })
  images: string[];
}
