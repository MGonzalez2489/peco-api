import { IsEnum, IsNumber, IsString } from 'class-validator';
import { EntryTypeEnum } from 'src/common/enums';

export class UpdateEntryDto {
  @IsNumber()
  amount: number;
  @IsString()
  description: string;
  @IsEnum(EntryTypeEnum)
  type: EntryTypeEnum;
}
