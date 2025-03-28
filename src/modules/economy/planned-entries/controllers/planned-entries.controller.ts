import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BaseController } from 'src/common/controllers/base.controller';
import { GetUser } from 'src/common/decorators';
import { PageOptionsDto } from 'src/common/dtos/pagination';
import { User } from 'src/datasource/entities';
import { PlannedEntry } from 'src/datasource/entities/economy/planned-entry.entity';
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
