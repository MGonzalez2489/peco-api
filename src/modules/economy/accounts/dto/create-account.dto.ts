import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateAccountDto {
  @IsString()
  name: string;

  @IsNumber()
  initialBalance: number;

  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;
}
