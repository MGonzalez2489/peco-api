import { IsNumber, IsString } from 'class-validator';

export class CreateAccountDto {
  @IsString()
  name: string;

  @IsNumber()
  balance: number;

  @IsString()
  accountTypeId: string;

  @IsString()
  color: string;
}
