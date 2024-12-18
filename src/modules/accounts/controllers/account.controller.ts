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
import {
  ApiModelOkResponse,
  ApiOkPaginatedResponse,
  GetUser,
} from 'src/common/decorators';
import { Account, User } from 'src/datasource/entities';
import { CreateAccountDto } from '../dto';
import {
  PageOptionsDto,
  PaginatedResponseDto,
} from 'src/common/dtos/pagination';
import { BaseController } from 'src/common/controllers/base.controller';
import { ResponseDto } from 'src/common/dtos/responses';

@Controller('accounts')
@ApiTags('Accounts')
export class AccountController extends BaseController<any> {
  constructor(private readonly service: AccountService) {
    super();
  }

  @Get()
  @ApiOkPaginatedResponse(User)
  async getAllByUserId(
    @Query() paginationDto: PageOptionsDto,
    @GetUser() user: User,
  ): Promise<PaginatedResponseDto<Account>> {
    return this.service.getAccountsByUser(paginationDto, user);
  }

  @Get(':accountId')
  async getByid(
    @Param('accountId') accountId: string,
    @GetUser() user: User,
  ): Promise<ResponseDto<Account>> {
    const result = await this.service.getAccountById(accountId, user);
    return this.Response(result);
  }

  @Post()
  @ApiModelOkResponse(Account)
  async create(
    @Body() dto: CreateAccountDto,
    @GetUser() user: User,
  ): Promise<ResponseDto<Account>> {
    const result = await this.service.createAccount(dto, user);
    return this.Response(result);
  }

  @Put(':accountId')
  @ApiModelOkResponse(Account)
  async update(
    @Body() dto: CreateAccountDto,
    @Param('accountId') accountId: string,
    @GetUser() user: User,
  ): Promise<ResponseDto<Account>> {
    const result = await this.service.updateAccount(dto, accountId, user);
    return this.Response(result);
  }
  @Delete(':accountId')
  async delete(
    @Param('accountId') accountId: string,
    @GetUser() user: User,
  ): Promise<ResponseDto<boolean>> {
    const result = await this.service.deleteAccount(accountId, user);
    return this.Response(result);
  }
}
