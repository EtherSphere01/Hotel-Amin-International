import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ContactFormDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsString()
  @IsNotEmpty()
  subject: string;
}
