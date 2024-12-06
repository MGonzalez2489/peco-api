import { IsEmail } from 'class-validator';

export class UserCreateDto {
  @IsEmail()
  email: string;
}
