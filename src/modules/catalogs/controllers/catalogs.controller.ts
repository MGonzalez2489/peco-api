import { Controller, Get, Query } from '@nestjs/common';
import { CatalogsService } from '../services/catalogs.service';
import { Public } from 'src/common/decorators';
import { ApiTags } from '@nestjs/swagger';
import { PageOptionsDto } from 'src/common/dtos/pagination';

@Controller('catalogs')
@ApiTags('Catalogs')
export class CatalogsController {
  constructor(private readonly catService: CatalogsService) {}

  @Get('InitCatalogs')
  @Public()
  async initCatalogs() {
    return await this.catService.initCatalogs();
  }

  @Get('entry-types')
  @Public()
  async getEntryTypes(@Query() paginationDto: PageOptionsDto) {
    return await this.catService.getEntryTypes(paginationDto);
  }
}
