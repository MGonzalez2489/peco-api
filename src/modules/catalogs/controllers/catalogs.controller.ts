import { Controller, Get } from '@nestjs/common';
import { CatalogsService } from '../services/catalogs.service';
import { Public } from 'src/common/decorators';
import { ApiTags } from '@nestjs/swagger';

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
  async getEntryTypes() {
    return await this.catService.getEntryTypes();
  }
}
