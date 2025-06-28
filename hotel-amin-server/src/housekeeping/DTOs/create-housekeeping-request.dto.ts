import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateHousekeepingRequestDto {
  @IsNumber()
  room: number;

  @IsString()
  phone: string;

  @IsOptional()
  @IsString()
  description?: string;
}
