import { IsNumber, IsString, IsUUID } from 'class-validator';

export class CreateEntryDto {
  @IsNumber()
  amount: number;

  @IsString()
  description: string;

  @IsUUID()
  categoryId: string;

  @IsUUID()
  entryTypeId: string;

  @IsString()
  accountId: string;
}
