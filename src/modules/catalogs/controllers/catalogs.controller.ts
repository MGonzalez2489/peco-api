import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorators';
import { PageOptionsDto } from 'src/common/dtos/pagination';
import { CatAccountTypeService, CatEntryTypeService } from '../services';
import { CatEntryStatusService } from '../services/cat-entry-status.service';

@Controller('catalogs')
@ApiTags('Catalogs')
export class CatalogsController {
  constructor(
    private readonly catEntryTypeService: CatEntryTypeService,
    private readonly catEntryStatusService: CatEntryStatusService,
    private readonly catAccountTypeService: CatAccountTypeService,
  ) {}

  @Get('entry-types')
  @Public()
  async getEntryTypes(@Query() paginationDto: PageOptionsDto) {
    return await this.catEntryTypeService.getPaginatedEntryTypesAsync(
      paginationDto,
    );
  }
  @Get('account-types')
  @Public()
  async getAccountTypes(@Query() paginationDto: PageOptionsDto) {
    return await this.catAccountTypeService.getPaginatedAccountTypesAsync(
      paginationDto,
    );
  }

  @Get('entry-status')
  @Public()
  async getEntryStatus(@Query() paginationDto: PageOptionsDto) {
    return await this.catEntryStatusService.getPaginatedEntryStatusAsync(
      paginationDto,
    );
  }
}
