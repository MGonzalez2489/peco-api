import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EntriesService } from '../services/entries.service';
import { CreateEntryDto } from '../dtos';
import { GetUser } from 'src/common/decorators';
import { User } from 'src/datasource/entities';
import { BaseController } from 'src/common/controllers/base.controller';
import { ResponseDto } from 'src/common/dtos/responses';
import { PageOptionsDto } from 'src/common/dtos/pagination';
import { Entry } from 'src/datasource/entities/economy';

@Controller('entries')
@ApiTags('Entries')
export class EntriesController extends BaseController<Entry> {
  constructor(private readonly service: EntriesService) {
    super();
  }

  @Post(':accountId/entry')
  async createIncome(
    @Body() createDto: CreateEntryDto,
    @Param('accountId') accountId: string,
    @GetUser() user: User,
  ): Promise<ResponseDto<Entry>> {
    const result = await this.service.createEntry(createDto, accountId, user);
    return this.Response(result);
  }

  @Get(':accountId')
  getEntriesByAccount(
    @Query() paginationDto: PageOptionsDto,
    @Param('accountId') accountId: string,
    @GetUser() user: User,
  ) {
    return this.service.getEntriesByAccount(accountId, paginationDto, user);
  }
}
