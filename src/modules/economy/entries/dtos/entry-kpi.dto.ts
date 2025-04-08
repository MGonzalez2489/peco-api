import { IsOptional, IsString, ValidateIf } from 'class-validator';

// type: 'TODAY' | 'WEEK' | 'MONTH' | 'YEAR';
const validTypeValues = ['TODAY', 'WEEK', 'MONTH', 'YEAR'];
export class EntryKPIRequestDto {
  @IsString()
  @ValidateIf((v: string) => validTypeValues.some((f) => f === v))
  type: string;

  @IsString()
  from: string;
  @IsString()
  to: string;
  @IsOptional()
  accountId?: string;
}

export interface EntryKPIResponseDto {
  labels: string[];
  datasets: EntryKPIDataSet[];
  period: string;
}

export interface EntryKPIDataSet {
  label: string;
  data: number[];
}
