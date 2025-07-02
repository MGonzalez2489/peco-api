import { BaseController } from '@common/controllers/base.controller';
import { GetUser } from '@common/decorators';
import { User } from '@datasource/entities';
import {
  Body,
  Controller,
  Get,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { UpdateUserDto } from '../dto';
import { UserService } from '../services/user.service';
import { PeriodTypeEnum } from '@common/enums';

@Controller('user')
@ApiTags('User')
export class UserController extends BaseController {
  constructor(private readonly service: UserService) {
    super();
  }

  @Get()
  getUser(@GetUser() user: User) {
    return this.Response(user);
  }

  @Put()
  @UseInterceptors(FileInterceptor('avatar'))
  async update(
    @GetUser() user: User,
    @Body() dto: UpdateUserDto,
    @UploadedFile() avatar: Express.Multer.File,
  ) {
    const result = await this.service.update(user, dto, avatar);
    return this.Response(result);
  }

  @Get('general')
  async getGeneralInfo(@Query('period') period: string, @GetUser() user: User) {
    const result = await this.service.getGeneralInfoAsync(
      PeriodTypeEnum.WEEK,
      user,
    );
    return this.Response(result);
  }
}
