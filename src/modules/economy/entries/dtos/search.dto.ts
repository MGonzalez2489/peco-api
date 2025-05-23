import { PageOptionsDto } from '@common/dtos/pagination';
import { IsOptional, IsString } from 'class-validator';

export class SearchEntriesDto extends PageOptionsDto {
  //Optionals
  @IsOptional()
  @IsString()
  readonly accountId?: string;

  @IsOptional()
  @IsString()
  readonly description?: string;
  @IsOptional()
  @IsString()
  readonly categoryId?: string;
  @IsOptional()
  @IsString()
  readonly entryTypeId?: string;

  @IsOptional()
  @IsString()
  from: string;

  @IsOptional()
  @IsString()
  to: string;
}
