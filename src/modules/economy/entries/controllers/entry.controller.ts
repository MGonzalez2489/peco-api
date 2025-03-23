import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BaseController } from 'src/common/controllers/base.controller';
import { GetUser } from 'src/common/decorators';
import { ResponseDto } from 'src/common/dtos/responses';
import { User } from 'src/datasource/entities';
import { Entry } from 'src/datasource/entities/economy';
import { CreateEntryDto } from '../dtos';
import { SearchEntriesDto } from '../dtos/search.dto';
import { EntryService } from '../services/entry.service';

@Controller('entries')
@ApiTags('Entries')
export class EntryController extends BaseController<Entry> {
  constructor(private readonly service: EntryService) {
    super();
  }

  @Post(':accountId/new')
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
