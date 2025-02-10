import { IsOptional, IsString } from 'class-validator';
import { PageOptionsDto } from 'src/common/dtos/pagination';

export class SearchEntriesDto extends PageOptionsDto {
  //required
  @IsString()
  readonly fromDate?: string;
  @IsString()
  readonly toDate?: string;
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
}
