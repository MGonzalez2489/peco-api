/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
import { PBaseEntity } from '@datasource/entities/_base';
import { InternalServerErrorException } from '@nestjs/common';
import { ObjectLiteral, Repository, SelectQueryBuilder } from 'typeorm';
import {
  PageMetaDto,
  PageOptionsDto,
  PaginatedResponseDto,
} from '../dtos/pagination';

export class BaseService<Entity extends PBaseEntity> {
  constructor(protected repository?: Repository<Entity>) {}

  async Search(pageOptionsDto: PageOptionsDto, where: ObjectLiteral) {
    try {
      if (!this.repository) {
        throw new InternalServerErrorException('Repository not implemented');
      }

      let queryBuilder = this.repository.createQueryBuilder();
      queryBuilder.where(where);

      queryBuilder = queryBuilder.orderBy(
        pageOptionsDto.orderBy || 'ASC',
        pageOptionsDto.order,
      );

      return await this.applyPagination(pageOptionsDto, queryBuilder);
    } catch (error) {
      this.ThrowException('BaseService::Search', error);
    }
  }
  async SearchByQuery(
    query: SelectQueryBuilder<Entity>,
    pageOptionsDto: PageOptionsDto,
  ) {
    return await this.applyPagination(pageOptionsDto, query);
  }

  private async applyPagination(
    pageOptions: PageOptionsDto,
    query: SelectQueryBuilder<any>,
  ): Promise<PaginatedResponseDto<Entity | any>> {
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

  ThrowException(place: string, error: any) {
    // console.log(place, error);

    throw error;
  }
}
