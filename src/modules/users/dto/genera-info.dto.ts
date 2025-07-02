export interface GeneralInfoDto {
  balance: GeneralBalanceDto;
  income: TotalIncomeDto;
  outcome: TotalOutcomeDto;
  noOfAccounts: number;
  noOfEntries: number;

  // 2.- Ingresos Total (# y %)
  // 3.- Gastos Total (# y %)
  // 4.- Total transacciones
  // 5.- Total de Cuentas
}

export interface GeneralBalanceDto {
  amount: number; //total
  entriesCount: number;
  variantPercentage: string;
}

export interface TotalIncomeDto {
  amount: number;
  entriesCount: number;
}
export interface TotalOutcomeDto {
  amount: number;
  entriesCount: number;
}
