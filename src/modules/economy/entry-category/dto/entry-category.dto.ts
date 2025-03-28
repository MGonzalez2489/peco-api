import { EntryCategory } from '@datasource/entities/economy';
import { IsBoolean, IsOptional, IsString, IsUUID } from 'class-validator';

export class EntryCategoryDto {
  name: string;
  parentId: string;
  publicId: string;
  isDefault: boolean;
  isVisible: boolean;
  subCategories: EntryCategoryDto[];

  constructor(entity?: EntryCategory) {
    if (entity) {
      this.name = entity.name;
      this.parentId = entity.parent?.publicId;
      this.publicId = entity.publicId;
      this.isDefault = entity.isDefault;
      this.isVisible = entity.isVisible;
      this.subCategories = [];
    }
  }
}

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
