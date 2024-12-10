import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EntriesService } from '../services/entries.service';
import { CreateEntryDto } from '../dtos';
import { GetUser } from 'src/common/decorators';
import { User } from 'src/datasource/entities';

@Controller('entries')
@ApiTags('Entries')
export class EntriesController {
  constructor(private readonly service: EntriesService) {}

  @Post(':accountId/income')
  async createIncome(
    @Body() createDto: CreateEntryDto,
    @Param('accountId') accountId: string,
    @GetUser() user: User,
  ) {
    return await this.service.createIncome(createDto, accountId, user);
  }

  @Post(':accountId/outcome')
  createOutcome(
    @Body() createDto: CreateEntryDto,
    @Param('accountId') accountId: string,
    @GetUser() user: User,
  ) {
    return this.service.createOutcome(createDto, accountId, user);
  }

  @Get(':accountId')
  getEntriesByAccount(
    @Param('accountId') accountId: string,
    @GetUser() user: User,
  ) {
    return this.service.getEntriesByAccount(accountId, user);
  }
}
