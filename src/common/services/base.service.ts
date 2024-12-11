import { PBaseEntity } from 'src/datasource/entities/_base';
import { ObjectLiteral, Repository } from 'typeorm';
import {
  PageOptionsDto,
  PageMetaDto,
  PaginatedResponseDto,
} from '../dtos/pagination';
import { HttpStatus } from '@nestjs/common';
import { ResponseDto } from '../dtos/responses';

export class BaseService<Entity extends PBaseEntity> {
  constructor(public repository: Repository<Entity>) {}

  Response(data: any, statusCode?: HttpStatus): ResponseDto<Entity> {
    const code = statusCode ? statusCode : HttpStatus.OK;
    return new ResponseDto(data, code);
  }

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

    return new PaginatedResponseDto(entities, pageMetaDto);
  }
}
