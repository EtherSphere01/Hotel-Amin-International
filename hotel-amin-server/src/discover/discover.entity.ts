import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('discover')
export class Discover {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  imageUrl: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'float' })
  rating: number;

  @Column({ type: 'int' })
  reviewCount: number;

  @Column({ type: 'text' })
  description: string;
}
