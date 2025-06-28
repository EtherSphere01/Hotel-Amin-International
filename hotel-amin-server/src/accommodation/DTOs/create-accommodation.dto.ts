import {
  IsString,
  IsArray,
  IsOptional,
  IsNotEmpty,
  IsNumber,
} from 'class-validator';

export class CreateAccommodationDto {
  @IsString()
  @IsNotEmpty()
  category: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsString()
  @IsNotEmpty()
  max_adults: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  specs: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images: string[];
}
