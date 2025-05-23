import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  currentPassword: string;

  @IsString()
  @IsNotEmpty()
  newPassword: string;
}
