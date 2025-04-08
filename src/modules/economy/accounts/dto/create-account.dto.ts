import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateAccountDto {
  @IsString()
  name: string;

  @IsNumber()
  balance: number;

  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;

  @IsString()
  accountTypeId: string;

  @IsString()
  color: string;
}
