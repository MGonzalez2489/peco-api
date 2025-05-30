import { BaseController } from '@common/controllers/base.controller';
import { GetUser } from '@common/decorators';
import { PageOptionsDto } from '@common/dtos/pagination';
import { User } from '@datasource/entities';
import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  EntryCategoryCreateDto,
  EntryCategoryUpdateDto,
} from '../dto/entry-category.dto';
import { EntryCategoryService } from '../services/entry-category.service';

@Controller('entry-category')
@ApiTags('Entry Category')
export class EntryCategoryController extends BaseController {
  constructor(private readonly service: EntryCategoryService) {
    super();
  }

  @Get()
  getCategories(@Query() paginationDto: PageOptionsDto, @GetUser() user: User) {
    return this.service.getAllAsync(user, paginationDto);
  }

  @Post()
  async create(@Body() dto: EntryCategoryCreateDto, @GetUser() user: User) {
    const response = await this.service.createCategory(dto, user, false);
    return this.Response(response);
  }

  @Put(':categoryId')
  async update(
    @Body() dto: EntryCategoryUpdateDto,
    @Param('categoryId') categoryId: string,
  ) {
    const response = await this.service.update(dto, categoryId);
    return this.Response(response);
  }
}
