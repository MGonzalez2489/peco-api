import { PeriodTypeEnum } from '@common/enums';
import { Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class AccountSearchKpiDto {
  @IsEnum(PeriodTypeEnum)
  @Transform(({ value }) => {
    return PeriodTypeEnum[value];
  })
  periodType: PeriodTypeEnum;

  @IsString()
  @IsOptional()
  accountId?: string;
}
