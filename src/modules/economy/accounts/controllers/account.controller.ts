import { SearchAccountDto } from '@accounts/dto/search-account.dto';
import { BaseController } from '@common/controllers/base.controller';
import {
  ApiModelOkResponse,
  ApiOkPaginatedResponse,
  GetUser,
} from '@common/decorators';
import { ResponseDto } from '@common/dtos/responses';
import { User } from '@datasource/entities';
import { Account } from '@datasource/entities/economy';
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
import { AccountDto, CreateAccountDto } from '../dto';
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
    @Query() paginationDto: SearchAccountDto,
    @GetUser() user: User,
  ) {
    const response = await this.service.getAccountsByUserAsync(
      paginationDto,
      user,
    );

    const newData: AccountDto[] = await Promise.all(
      response.data.map(async (acc: Account) => {
        let kpis = null;
        if (paginationDto.fetchKPIs) {
          kpis = await this.service.getAccountKPIs(
            acc,
            paginationDto.from,
            paginationDto.to,
            paginationDto.period,
          );
        }

        return {
          ...acc,
          kpis,
        };
      }),
    );

    const newResponse = {
      ...response,
      data: newData,
    };

    return newResponse;
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
