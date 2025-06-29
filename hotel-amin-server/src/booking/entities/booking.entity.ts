import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Employee } from '../../management/entities/employee.entity';
import { Rooms } from '../../room/entities/room.entity';
import { Coupon } from '../../coupon/entities/coupon.entity';
import { Accounts } from './accounts.entity';
import { RestaurantHistory } from '../../restaurant/entities/restaurant-history.entity';
import { CouponUsage } from '../../coupon/entities/coupon-usage.entity';
import { HousekeepingHistory } from '../../housekeeping/entities/housekeeping-history.entity';
import { BookingReview } from '../../feedback/entities/booking-review.entity';

export enum PaymentStatus {
  PENDING = 'pending',
  PARTIAL = 'partial',
  PAID = 'paid',
}

export enum TypeOfBooking {
  ONLINE = 'online',
  OFFLINE = 'offline',
}

@Entity('Booking')
export class Booking {
  @PrimaryGeneratedColumn()
  booking_id: number;

  @Column({ type: 'date' })
  checkin_date: Date;

  @Column({ type: 'date' })
  checkout_date: Date;

  @Column()
  number_of_guests: number;

  @Column({ type: 'int', nullable: false })
  room_price: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  coupon_percent?: number;

  @Column({ type: 'int' })
  total_price: number;

  @Column({ type: 'enum', enum: PaymentStatus })
  payment_status: PaymentStatus;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  booking_date: Date;

  @Column({ type: 'enum', enum: TypeOfBooking })
  typeOfBooking: TypeOfBooking;

  @OneToMany(() => Rooms, (room) => room.booking)
  rooms: Rooms[];

  @Column({ type: 'int', nullable: false })
  no_of_rooms: number;

  @Column({ type: 'varchar', nullable: false })
  user_phone: string;

  @ManyToOne(() => Coupon, (coupon) => coupon.bookings, { nullable: true })
  @JoinColumn({ name: 'coupon_code' })
  coupon?: Coupon;

  @ManyToOne(() => Employee, (employee) => employee.bookings, {
    nullable: true,
  })
  @JoinColumn({ name: 'employee_id' })
  employee?: Employee;

  @OneToMany(() => Accounts, (account) => account.booking)
  accounts: Accounts[];

  @OneToMany(() => RestaurantHistory, (history) => history.booking)
  restaurantHistory: RestaurantHistory[];

  @OneToMany(() => CouponUsage, (couponUsage) => couponUsage.booking)
  couponUsages: CouponUsage[];

  @OneToMany(() => HousekeepingHistory, (history) => history.booking)
  housekeepingHistory: HousekeepingHistory[];

  @OneToOne(() => BookingReview, (review) => review.booking, { nullable: true })
  review?: BookingReview;
}
