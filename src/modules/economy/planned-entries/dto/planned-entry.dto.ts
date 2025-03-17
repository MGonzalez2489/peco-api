import { IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import {
  PlannedEntryFrecuencyEndEnum,
  PlannedEntryFrecuencyEnum,
  PlannedEntryRecurrencyEnum,
} from './../../../../common/enums/PlannedEntry.enum';

export class PlannedEntryCreateDto {
  ///////////////////////////////required properties
  @IsString()
  description: string;

  @IsNumber()
  amount: number;

  @IsUUID()
  categoryId: string;

  @IsUUID()
  entryTypeId: string;

  ///////////////////////////////

  //Repeat

  @IsString()
  frecuency: PlannedEntryFrecuencyEnum;

  @IsString()
  @IsOptional()
  recuencyEnd: PlannedEntryFrecuencyEndEnum;

  @IsString()
  @IsOptional()
  recurrency: PlannedEntryRecurrencyEnum;

  @IsString()
  startDate: string;

  @IsString()
  @IsOptional()
  endDate: string;

  @IsString()
  @IsOptional()
  dayOfWeek: string;
  @IsNumber()
  @IsOptional()
  dayOfMonth: number;
}
