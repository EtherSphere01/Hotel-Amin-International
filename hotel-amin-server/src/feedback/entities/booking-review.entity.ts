import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Booking } from '../../booking/entities/booking.entity';

@Entity('BookingReview')
export class BookingReview {
  @PrimaryGeneratedColumn()
  review_id: number;

  @Column({ type: 'text' })
  review_text: string;

  @Column({ type: 'int', default: 5 })
  rating: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  guest_name: string; 

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_date: Date;

  @ManyToOne(() => User, (user) => user.bookingReviews)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Booking, (booking) => booking.review)
  @JoinColumn({ name: 'booking_id' })
  booking: Booking;
}
