import { BaseController } from '@common/controllers/base.controller';
import { GetUser } from '@common/decorators';
import { PageOptionsDto } from '@common/dtos/pagination';
import { User } from '@datasource/entities';
import { EntryCategory } from '@datasource/entities/economy';
import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  EntryCategoryCreateDto,
  EntryCategoryDto,
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
  async getCategories(
    @Query() paginationDto: PageOptionsDto,
    @GetUser() user: User,
  ) {
    const categories = await this.service.getAllAsync(user, paginationDto);

    const mappedArray = categories.data
      .filter((cat: EntryCategory) => !cat.parentId)
      .map((f: EntryCategory) => {
        const dto = new EntryCategoryDto(f);
        dto.subCategories = categories.data
          .filter((g: EntryCategory) => g.parentId === f.id)
          .map((h: EntryCategory) => new EntryCategoryDto(h));

        return dto;
      });

    const result = { ...categories, data: mappedArray };

    return result;
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
