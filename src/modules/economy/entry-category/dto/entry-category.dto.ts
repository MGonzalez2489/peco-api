import { IsOptional, IsString, IsUUID } from 'class-validator';

export class EntryCategoryCreateDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsUUID()
  parentId: string;
}
