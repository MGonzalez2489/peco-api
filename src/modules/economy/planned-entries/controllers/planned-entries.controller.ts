import { BaseController } from '@common/controllers/base.controller';
import { GetUser } from '@common/decorators';
import { PageOptionsDto } from '@common/dtos/pagination';
import { User } from '@datasource/entities';
import { PlannedEntry } from '@datasource/entities/economy/planned-entry.entity';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PlannedEntryCreateDto } from '../dto/planned-entry.dto';
import { PlannedEntriesService } from '../services/planned-entries.service';

@Controller('planned-entry')
@ApiTags('planned-entry')
export class PlannedEntriesController extends BaseController<PlannedEntry> {
  constructor(private readonly service: PlannedEntriesService) {
    super();
  }
  @Get()
  getEntries(@Query() paginationDto: PageOptionsDto, @GetUser() user: User) {
    return this.service.getall(paginationDto, user);
  }

  @Post()
  async create(@Body() dto: PlannedEntryCreateDto, @GetUser() user: User) {
    return this.Response(await this.service.createAsync(dto, user));
  }
}
