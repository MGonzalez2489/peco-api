import { IsNumber, IsString, IsUUID } from 'class-validator';

export class UpdateEntryDto {
  @IsNumber()
  amount: number;
  @IsString()
  description: string;
  @IsUUID()
  type: string;
}
