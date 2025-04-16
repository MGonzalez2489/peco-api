export interface AccountDto {
  publicId: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  balance: number;
  isRoot: boolean;
  type: AccountTypeDto;
  kpis: any;
}

export interface AccountTypeDto {
  publicId: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  displayName: string;
}
