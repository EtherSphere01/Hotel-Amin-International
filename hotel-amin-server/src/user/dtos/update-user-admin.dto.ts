import {
    IsBoolean,
    IsEmail,
    IsInt,
    IsOptional,
    IsString,
    MaxLength,
    MinLength,
    Min,
    Max,
} from 'class-validator';

export class UpdateUserAdminDto {
    @IsOptional()
    @IsString()
    @MinLength(3)
    @MaxLength(100)
    name?: string;

    @IsOptional()
    @IsEmail()
    @MaxLength(100)
    email?: string;

    @IsOptional()
    @IsString()
    @MinLength(8)
    @MaxLength(255)
    password?: string;

    @IsOptional()
    @IsString()
    @MinLength(10)
    @MaxLength(20)
    phone?: string;

    @IsOptional()
    @IsString()
    @MaxLength(500)
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
    @IsInt()
    @Min(1)
    @Max(120)
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
    @MaxLength(100)
    fatherName?: string;

    @IsOptional()
    @IsString()
    @MaxLength(50)
    role?: string;
}
