import {
  IsDate,
  IsInt,
  IsNumber,
  IsOptional,
  IsEnum,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { PaymentStatus, TypeOfBooking } from '../entities/booking.entity';
import { Type } from 'class-transformer';

export class CreateAccommodationBookingDto {
  @IsDate()
  @Type(() => Date)
  checkin_date: Date;

  @IsDate()
  @Type(() => Date)
  checkout_date: Date;

  @IsInt()
  number_of_guests: number;

  @IsOptional()
  @IsNumber()
  coupon_percent?: number;

  @IsEnum(PaymentStatus)
  payment_status: PaymentStatus;

  @IsEnum(TypeOfBooking)
  typeOfBooking: TypeOfBooking;

  @IsInt()
  no_of_rooms: number;

  @IsInt()
  accommodation_id: number;

  @IsOptional()
  @IsString()
  coupon_code?: string;

  @IsOptional()
  @IsInt()
  employee_id?: number;
}
