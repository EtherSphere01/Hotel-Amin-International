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

export class CreateGuestBookingDto {
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

  @IsString()
  @IsNotEmpty()
  guest_name: string;

  @IsString()
  @IsNotEmpty()
  guest_age: string;

  @IsString()
  @IsNotEmpty()
  guest_father_name: string;

  @IsString()
  @IsNotEmpty()
  guest_address: string;

  @IsOptional()
  @IsString()
  guest_relation?: string;

  @IsString()
  @IsNotEmpty()
  guest_mobile: string;

  @IsString()
  @IsNotEmpty()
  guest_nationality: string;

  @IsString()
  @IsNotEmpty()
  guest_profession: string;

  @IsString()
  @IsNotEmpty()
  guest_passport_nid: string;

  @IsString()
  @IsNotEmpty()
  guest_type: string;

  @IsOptional()
  @IsString()
  guest_vehicle_no?: string;
}
