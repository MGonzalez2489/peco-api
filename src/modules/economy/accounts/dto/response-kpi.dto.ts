import { PeriodDto } from '@common/dtos';

export interface AccountResponseKpiDto {
  period: PeriodDto;
  incomes: {
    totalAmount: number;
    totalCount: number;
  };
  outcomes: {
    totalAmount: number;
    totalCount: number;
  };
}
