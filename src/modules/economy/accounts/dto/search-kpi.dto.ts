import { IsOptional, IsString } from 'class-validator';

export class AccountSearchKpiDto {
  @IsString()
  from: string;
  @IsString()
  to: string;

  @IsString()
  @IsOptional()
  accountId?: string;
}
