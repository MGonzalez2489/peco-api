import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EntriesService } from '../services/entries.service';
import { CreateEntryDto } from '../dtos';
import { GetUser } from 'src/common/decorators';
import { User } from 'src/datasource/entities';
import { BaseController } from 'src/common/controllers/base.controller';
import { ResponseDto } from 'src/common/dtos/responses';
import { Entry } from 'src/datasource/entities/entry.entity';
import { PageOptionsDto } from 'src/common/dtos/pagination';

@Controller('entries')
@ApiTags('Entries')
export class EntriesController extends BaseController<any> {
  constructor(private readonly service: EntriesService) {
    super();
  }

  @Post(':accountId/income')
  async createIncome(
    @Body() createDto: CreateEntryDto,
    @Param('accountId') accountId: string,
    @GetUser() user: User,
  ): Promise<ResponseDto<Entry>> {
    const result = await this.service.createIncome(createDto, accountId, user);
    return this.Response(result);
  }

  @Post(':accountId/outcome')
  async createOutcome(
    @Body() createDto: CreateEntryDto,
    @Param('accountId') accountId: string,
    @GetUser() user: User,
  ): Promise<ResponseDto<Entry>> {
    const result = await this.service.createOutcome(createDto, accountId, user);
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
