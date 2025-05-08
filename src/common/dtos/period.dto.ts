import { PeriodTypeEnum } from '@common/enums';

export interface PeriodDto {
  type: PeriodTypeEnum;
  from: string;
  to: string;
}
