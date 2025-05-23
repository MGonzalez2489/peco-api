import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { PaginationOrderEnum } from '../../../common/enums';

export class PageOptionsDto {
  @ApiPropertyOptional({
    enum: PaginationOrderEnum,
    default: PaginationOrderEnum.DESC,
  })
  @IsEnum(PaginationOrderEnum)
  @IsOptional()
  readonly order?: PaginationOrderEnum = PaginationOrderEnum.DESC;

  @IsOptional()
  @IsString()
  readonly orderBy?: string = 'CreatedAt';

  @ApiPropertyOptional({
    minimum: 1,
    default: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  readonly page?: number = 1;

  @ApiPropertyOptional({
    minimum: 1,
    // maximum: 50,
    default: 10,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  // @Max(50)
  @IsOptional()
  readonly take?: number = 10;

  @IsString()
  @IsOptional()
  readonly hint?: string;

  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  showAll: boolean;

  get skip(): number {
    return (this.page ? this.page - 1 : 0) * (this.take ? this.take : 0);
  }
}
