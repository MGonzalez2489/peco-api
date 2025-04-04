import { BaseController } from '@common/controllers/base.controller';
import { GetUser } from '@common/decorators';
import { ResponseDto } from '@common/dtos/responses';
import { User } from '@datasource/entities';
import { Entry } from '@datasource/entities/economy';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateEntryDto } from '../dtos';
import { SearchEntriesDto } from '../dtos/search.dto';
import { EntryService } from '../services/entry.service';

@Controller('entries')
@ApiTags('Entries')
export class EntryController extends BaseController<Entry> {
  constructor(private readonly service: EntryService) {
    super();
  }

  @Post()
  async createEntry(
    @Body() createDto: CreateEntryDto,
    @GetUser() user: User,
  ): Promise<ResponseDto<Entry>> {
    const result = await this.service.createEntryAsync(createDto, user);
    return this.Response(result);
  }

  @Get()
  getEntries(@Query() paginationDto: SearchEntriesDto, @GetUser() user: User) {
    return this.service.getEntriesByAccountAsync(paginationDto, user);
  }
}
