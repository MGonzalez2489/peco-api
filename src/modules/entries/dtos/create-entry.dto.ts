import { IsNumber, IsString } from 'class-validator';

export class CreateEntryDto {
  @IsNumber()
  amount: number;

  @IsString()
  description: string;

  @IsString()
  categoryId: string;
}
