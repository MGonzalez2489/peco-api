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
import { CreateAccountDto } from '../dto';
import { AccountService } from '../services/account.service';

@Controller('accounts')
@ApiTags('Accounts')
export class AccountController extends BaseController {
  constructor(private readonly service: AccountService) {
    super();
  }

  @Get()
  @ApiOkPaginatedResponse(User)
  async getAllByUserId(
    @Query() paginationDto: SearchAccountDto,
    @GetUser() user: User,
  ) {
    return await this.service.getAccountsByUserAsync(paginationDto, user);
  }

  @Get(':id')
  async getAccountById(
    @Param('id') accountId: string,
    @GetUser() user: User,
  ): Promise<ResponseDto<Account | null | undefined>> {
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
  ): Promise<ResponseDto<Account | undefined | null>> {
    const result = await this.service.createAccountAsync(dto, user);
    return this.Response(result);
  }

  @Put(':id')
  @ApiModelOkResponse(Account)
  async update(
    @Body() dto: CreateAccountDto,
    @Param('id') accountId: string,
    @GetUser() user: User,
  ): Promise<ResponseDto<Account | undefined | null>> {
    const result = await this.service.updateAccountAsync(dto, accountId, user);
    return this.Response(result);
  }
  @Delete(':id')
  async delete(
    @Param('id') accountId: string,
    @GetUser() user: User,
  ): Promise<ResponseDto<boolean | undefined>> {
    const result = await this.service.deleteAccount(accountId, user);
    return this.Response(result);
  }
}
