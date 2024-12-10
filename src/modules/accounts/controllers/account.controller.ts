import { Controller, Get } from '@nestjs/common';
import { AccountService } from '../services/account.service';
import { ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/common/decorators';
import { User } from 'src/datasource/entities';

@Controller('accounts')
@ApiTags('Accounts')
export class AccountController {
  constructor(private readonly service: AccountService) {}

  @Get()
  getAllByUserId(@GetUser() user: User) {
    return this.service.getAccountsByUser(user);
  }
}
