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
import { ApiTags } from '@nestjs/swagger';
import { BaseController } from 'src/common/controllers/base.controller';
import {
  ApiModelOkResponse,
  ApiOkPaginatedResponse,
  GetUser,
} from 'src/common/decorators';
import {
  PageOptionsDto,
  PaginatedResponseDto,
} from 'src/common/dtos/pagination';
import { ResponseDto } from 'src/common/dtos/responses';
import { User } from 'src/datasource/entities';
import { Account } from 'src/datasource/entities/economy';
import { CreateAccountDto } from '../dto';
import { AccountService } from '../services/account.service';

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
    return this.service.getAccountsByUserAsync(paginationDto, user);
  }

  @Get(':accountId')
  async getAccountById(
    @Param('accountId') accountId: string,
    @GetUser() user: User,
  ): Promise<ResponseDto<Account>> {
    const result = await this.service.getAccountByPublicIdAsync(
      accountId,
      user,
    );
    return this.Response(result);
  }

  @Post()
  @ApiModelOkResponse(Account)
  async create(
    @Body() dto: CreateAccountDto,
    @GetUser() user: User,
  ): Promise<ResponseDto<Account>> {
    const result = await this.service.createAccountAsync(dto, user);
    return this.Response(result);
  }

  @Put(':accountId')
  @ApiModelOkResponse(Account)
  async update(
    @Body() dto: CreateAccountDto,
    @Param('accountId') accountId: string,
    @GetUser() user: User,
  ): Promise<ResponseDto<Account>> {
    const result = await this.service.updateAccountAsync(dto, accountId, user);
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
