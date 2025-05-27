import { EntryType } from '@datasource/entities/catalogs';
import { EntryCategory } from '@datasource/entities/economy';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class EntryCategoryDto {
  name: string;
  parentId: string;
  publicId: string;
  isDefault: boolean;
  isVisible: boolean;
  subCategories: EntryCategoryDto[];
  icon: string;
  color: string;
  forType: EntryType;

  constructor(entity?: EntryCategory) {
    if (entity) {
      this.name = entity.name;
      this.parentId = entity.parent?.publicId;
      this.publicId = entity.publicId;
      this.isDefault = entity.isDefault;
      this.isVisible = entity.isVisible;
      this.subCategories = [];
      this.icon = entity.icon;
      this.color = entity.color;
      this.forType = entity.forType;
    }
  }
}

export class EntryCategoryCreateDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsUUID()
  parentId?: string;

  @IsString()
  icon: string;

  @IsString()
  color: string;

  @IsNumber()
  forTypeId: number;
}

export class EntryCategoryUpdateDto {
  @IsString()
  name: string;

  @IsBoolean()
  isVisible: boolean;
}
