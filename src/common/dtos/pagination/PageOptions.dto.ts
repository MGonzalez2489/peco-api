import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { PaginationOrderEnum } from 'src/common/enums';

export class PageOptionsDto {
  @ApiPropertyOptional({
    enum: PaginationOrderEnum,
    default: PaginationOrderEnum.ASC,
  })
  @IsEnum(PaginationOrderEnum)
  @IsOptional()
  readonly order?: PaginationOrderEnum = PaginationOrderEnum.ASC;

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
    maximum: 50,
    default: 10,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  @IsOptional()
  readonly take?: number = 10;

  get skip(): number {
    return (this.page - 1) * this.take;
  }
}
