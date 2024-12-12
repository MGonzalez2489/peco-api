import { PBaseEntity } from 'src/datasource/entities/_base';
import { ObjectLiteral, Repository } from 'typeorm';
import {
  PageOptionsDto,
  PageMetaDto,
  PaginatedResponseDto,
} from '../dtos/pagination';
import { HttpStatus, InternalServerErrorException } from '@nestjs/common';
import { ResponseDto } from '../dtos/responses';

export class BaseService<Entity extends PBaseEntity | any> {
  constructor(protected repository?: Repository<Entity>) {}

  Response(data: any, statusCode?: HttpStatus): ResponseDto<Entity> {
    const code = statusCode ? statusCode : HttpStatus.OK;
    return new ResponseDto(data, code);
  }

  async Search(pageOptionsDto: PageOptionsDto, where: ObjectLiteral) {
    try {
      if (!this.repository) {
        throw new InternalServerErrorException('Repository not implemented');
      }

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
    } catch (error) {
      this.ThrowException('BaseService::Search', error);
    }
  }

  ThrowException(place: string, error: any) {
    console.log(place, error);
    throw new InternalServerErrorException(error);
  }
}
