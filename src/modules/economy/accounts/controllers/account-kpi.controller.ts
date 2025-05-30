import { AccountSearchKpiDto } from '@accounts/dto';
import { AccountsKpiService } from '@accounts/services/accounts-kpi.service';
import { BaseController } from '@common/controllers/base.controller';
import { GetUser } from '@common/decorators';
import { User } from '@datasource/entities';
import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller('account-kpi')
@ApiTags('Account-kpi')
export class AccountKpiController extends BaseController {
  constructor(private readonly service: AccountsKpiService) {
    super();
  }

  @Get()
  async getAllByUserId(
    @Query() filters: AccountSearchKpiDto,
    @GetUser() user: User,
  ) {
    const response = await this.service.getGeneralKPIs(filters, user);
    return this.Response(response);
  }
}
