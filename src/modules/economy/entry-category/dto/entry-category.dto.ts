import { IsBoolean, IsOptional, IsString, IsUUID } from 'class-validator';

export class EntryCategoryCreateDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsUUID()
  parentId: string;
}

export class EntryCategoryUpdateDto {
  @IsString()
  name: string;

  @IsBoolean()
  isVisible: boolean;
}
