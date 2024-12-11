import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { AccountService } from '../services/account.service';
import { ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/common/decorators';
import { User } from 'src/datasource/entities';
import { CreateAccountDto } from '../dto';
import { PageOptionsDto } from 'src/common/dtos/pagination';

@Controller('accounts')
@ApiTags('Accounts')
export class AccountController {
  constructor(private readonly service: AccountService) {}

  @Get()
  getAllByUserId(
    @Query() paginationDto: PageOptionsDto,
    @GetUser() user: User,
  ) {
    return this.service.getAccountsByUser(paginationDto, user);
  }

  @Post()
  create(@Body() dto: CreateAccountDto, @GetUser() user: User) {
    return this.service.createAccount(dto, user);
  }

  @Put(':accountId')
  update(
    @Body() dto: CreateAccountDto,
    @Param('accountId') accountId: string,
    @GetUser() user: User,
  ) {
    return this.service.updateAccount(dto, accountId, user);
  }
  @Delete(':accountId')
  delete(@Param('accountId') accountId: string, @GetUser() user: User) {
    return this.service.deleteAccount(accountId, user);
  }
}
