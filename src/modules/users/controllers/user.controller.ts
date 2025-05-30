import { BaseController } from '@common/controllers/base.controller';
import { GetUser } from '@common/decorators';
import { User } from '@datasource/entities';
import {
  Body,
  Controller,
  Get,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { UpdateUserDto } from '../dto';
import { UserService } from '../services/user.service';

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
}
