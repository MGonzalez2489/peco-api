import { PageOptionsDto } from '@common/dtos/pagination';
import { Transform } from 'class-transformer';
import { IsBoolean } from 'class-validator';

export class SearchAccountDto extends PageOptionsDto {
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  readonly fetchKPIs = false;
}
