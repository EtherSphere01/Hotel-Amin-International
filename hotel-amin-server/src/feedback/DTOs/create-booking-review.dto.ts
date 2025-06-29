import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsOptional,
  Min,
  Max,
} from 'class-validator';

export class CreateBookingReviewDto {
  @IsNotEmpty()
  @IsString()
  review_text: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @IsOptional()
  @IsString()
  guest_name?: string;

  @IsNumber()
  booking_id: number;

  @IsNumber()
  user_id: number;
}
