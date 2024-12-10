import { IsEmail, IsOptional, IsString } from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsOptional()
  password: string;
}
