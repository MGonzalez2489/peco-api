import { BaseController } from '@common/controllers/base.controller';
import { GetUser } from '@common/decorators';
import { ResponseDto } from '@common/dtos/responses';
import { User } from '@datasource/entities';
import { Entry } from '@datasource/entities/economy';
import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateEntryDto } from '../dtos';
import { SearchEntriesDto } from '../dtos/search.dto';
import { EntryService } from '../services/entry.service';

@Controller('entries')
@ApiTags('Entries')
export class EntryController extends BaseController {
  constructor(private readonly service: EntryService) {
    super();
  }

  @Post()
  async createEntry(
    @Body() createDto: CreateEntryDto,
    @GetUser() user: User,
  ): Promise<ResponseDto<Entry | undefined>> {
    const result = await this.service.createEntryAsync(createDto, user);
    return this.Response(result);
  }

  @Get()
  getEntries(@Query() paginationDto: SearchEntriesDto, @GetUser() user: User) {
    return this.service.getEntriesByAccountAsync(paginationDto, user);
  }

  @Get('/meters')
  async getEntriesStats(
    @Query() paginationDto: SearchEntriesDto,
    @GetUser() user: User,
  ) {
    const response = await this.service.getEntriesStats(paginationDto, user);
    return this.Response(response);
  }

  @Get(':id')
  async getById(
    @Param('id') id: string,
    @GetUser() user: User,
  ): Promise<ResponseDto<Entry>> {
    const result = await this.service.getEntryById(id, user);
    return this.Response(result);
  }
}
