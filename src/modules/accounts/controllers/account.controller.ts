import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { AccountService } from '../services/account.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('accounts')
@ApiTags('Accounts')
export class AccountController {
  constructor(private readonly service: AccountService) {}

  @Get(':userId')
  getAllByUserId(@Param('userId', ParseUUIDPipe) id: string) {
    return this.service.getAccountsByUserId(id);
  }
}
