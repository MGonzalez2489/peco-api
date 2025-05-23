import { IPageMetaParameters } from '@common/interfaces';
import { ApiProperty } from '@nestjs/swagger';

export class PageMetaDto {
  @ApiProperty()
  readonly page: number;

  @ApiProperty()
  readonly take: number;

  @ApiProperty()
  readonly itemCount: number;

  @ApiProperty()
  readonly pageCount: number;

  @ApiProperty()
  readonly hasPreviousPage: boolean;

  @ApiProperty()
  readonly hasNextPage: boolean;

  constructor({ pageOptionsDto, itemCount }: IPageMetaParameters) {
    if (pageOptionsDto) {
      this.page = pageOptionsDto.showAll ? 0 : pageOptionsDto.page! - 1;
      this.take = pageOptionsDto.showAll ? itemCount : pageOptionsDto.take!;
      this.itemCount = itemCount;
      this.pageCount = pageOptionsDto.showAll
        ? 1
        : Math.ceil(this.itemCount / this.take);
      this.hasPreviousPage = pageOptionsDto.showAll ? false : this.page > 1;
      this.hasNextPage = pageOptionsDto.showAll
        ? false
        : this.page < this.pageCount;
    }
  }
}
