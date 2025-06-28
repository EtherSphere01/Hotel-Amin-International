import {
  IsOptional,
  IsString,
  IsEmail,
  IsPhoneNumber,
  IsNumber,
  IsBoolean,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(100)
  email?: string;

  @IsOptional()
  @IsPhoneNumber('BD')
  @MinLength(11)
  @MaxLength(20)
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  nid?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  passport?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  nationality?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  profession?: string;

  @IsOptional()
  @IsNumber()
  age?: number;

  @IsOptional()
  @IsBoolean()
  maritalStatus?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  vehicleNo?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  fatherName?: string;
}
