import { Body, Controller, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EntriesService } from '../services/entries.service';
import { CreateEntryDto } from '../dtos';

@Controller('entries')
@ApiTags('Entries')
export class EntriesController {
  constructor(private readonly service: EntriesService) {}

  @Post(':accountId/income')
  createIncome(@Body() createDto: CreateEntryDto, @Query() accountId: string) {
    return this.service.createIncome(createDto, accountId);
  }

  @Post(':accountId/outcome')
  createOutcome(@Body() createDto: CreateEntryDto, @Query() accountId: string) {
    return this.service.createOutcome(createDto, accountId);
  }
}
