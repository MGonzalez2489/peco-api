import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsOptional()
  @ApiProperty({ required: false })
  password: string;
}
