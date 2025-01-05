import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BaseController } from 'src/common/controllers/base.controller';
import { Category, User } from 'src/datasource/entities';
import { CategoriesService } from '../services/categories.service';
import { GetUser } from 'src/common/decorators';
import { PageOptionsDto } from 'src/common/dtos/pagination';

@Controller('categories')
@ApiTags('Categories')
export class CategoriesController extends BaseController<Category> {
  constructor(private readonly service: CategoriesService) {
    super();
  }

  @Get()
  getCategories(@Query() paginationDto: PageOptionsDto, @GetUser() user: User) {
    return this.service.getAll(user, paginationDto);
  }
}
