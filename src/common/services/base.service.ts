import { PBaseEntity } from 'src/datasource/entities/_base';
import { ObjectLiteral, Repository } from 'typeorm';
import {
  PageOptionsDto,
  PageMetaDto,
  PaginatedResponse,
} from '../dtos/pagination';

export class BaseService<Entity extends PBaseEntity> {
  constructor(public repository: Repository<Entity>) {}

  async Search(pageOptionsDto: PageOptionsDto, where: ObjectLiteral) {
    const queryBuilder = this.repository.createQueryBuilder();

    queryBuilder
      .where(where)
      .orderBy('', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PaginatedResponse(entities, pageMetaDto);
  }
}
