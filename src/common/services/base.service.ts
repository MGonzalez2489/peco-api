import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';
import {
  PageMetaDto,
  PageOptionsDto,
  PaginatedResponseDto,
} from '../dtos/pagination';

export class BaseService {
  async SearchByQuery<T extends ObjectLiteral>(
    query: SelectQueryBuilder<T>,
    pageOptionsDto: PageOptionsDto,
  ) {
    return await this.applyPagination(pageOptionsDto, query);
  }

  private async applyPagination<T extends ObjectLiteral>(
    pageOptions: PageOptionsDto,
    query: SelectQueryBuilder<T>,
  ): Promise<PaginatedResponseDto<T>> {
    if (!pageOptions.showAll) {
      query.skip(pageOptions.skip).take(pageOptions.take);
    }

    const [entities, itemCount] = await query.getManyAndCount();

    const pageMetaDto = new PageMetaDto({
      itemCount,
      pageOptionsDto: pageOptions,
    });

    return new PaginatedResponseDto(entities, pageMetaDto);
  }

  ThrowException(place: string, error: unknown) {
    console.log(place, error);

    throw error;
  }
}
