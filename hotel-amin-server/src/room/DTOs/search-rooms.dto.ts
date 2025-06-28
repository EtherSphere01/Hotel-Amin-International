import { IsDateString, IsOptional, IsNumber, Min } from 'class-validator';

export class SearchRoomsDto {
  @IsDateString()
  checkIn: string;

  @IsDateString()
  checkOut: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  guests?: number;
}
