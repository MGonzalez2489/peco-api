import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EntryService } from '../services/entry.service';
import { CreateEntryDto } from '../dtos';
import { GetUser } from 'src/common/decorators';
import { User } from 'src/datasource/entities';
import { BaseController } from 'src/common/controllers/base.controller';
import { ResponseDto } from 'src/common/dtos/responses';
import { Entry } from 'src/datasource/entities/economy';
import { SearchEntriesDto } from '../dtos/search.dto';

@Controller('entries')
@ApiTags('Entries')
export class EntryController extends BaseController<Entry> {
  constructor(private readonly service: EntryService) {
    super();
  }
  // @Get()
  // getAllEntries(@Query() paginationDto: PageOptionsDto, @GetUser() user: User) {
  //   return this.service.getAllEntries(paginationDto, user);
  // }

  @Post(':accountId/entry')
  async createIncome(
    @Body() createDto: CreateEntryDto,
    @Param('accountId') accountId: string,
    @GetUser() user: User,
  ): Promise<ResponseDto<Entry>> {
    const result = await this.service.createEntryAsync(
      createDto,
      accountId,
      user,
    );
    return this.Response(result);
  }

  @Get()
  getEntries(@Query() paginationDto: SearchEntriesDto, @GetUser() user: User) {
    return this.service.getEntriesByAccountAsync(paginationDto, user);
  }
}
