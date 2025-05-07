export interface AccountResponseKpiDto {
  incomes: {
    totalAmount: number;
    totalCount: number;
  };
  outcomes: {
    totalAmount: number;
    totalCount: number;
  };
}
