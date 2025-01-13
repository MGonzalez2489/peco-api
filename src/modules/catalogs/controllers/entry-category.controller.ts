import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BaseController } from 'src/common/controllers/base.controller';
import { User } from 'src/datasource/entities';
import { GetUser } from 'src/common/decorators';
import { PageOptionsDto } from 'src/common/dtos/pagination';
import { EntryCategoryService } from '../services/entry-category.service';
import { EntryCategory } from 'src/datasource/entities/economy';

@Controller('categories')
@ApiTags('Catalogs')
export class EntryCategoryController extends BaseController<EntryCategory> {
  constructor(private readonly service: EntryCategoryService) {
    super();
  }

  @Get('entry-category')
  getCategories(@Query() paginationDto: PageOptionsDto, @GetUser() user: User) {
    return this.service.getAll(user, paginationDto);
  }
}
