import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateAccountDto {
  @IsString()
  name: string;

  @IsNumber()
  balance: number;

  @IsString()
  accountTypeId: string;

  @IsString()
  @IsOptional()
  bank?: string;

  @IsOptional()
  @IsString()
  accountNumber?: string;
}
