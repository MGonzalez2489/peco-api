import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CategoryCreateDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsUUID()
  parentId: string;
}
