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
import { diskStorage } from 'multer';
import { UpdateUserDto } from '../dto';
import { UserService } from '../services/user.service';

@Controller('user')
@ApiTags('User')
export class UserController extends BaseController<User> {
  constructor(private readonly service: UserService) {
    super();
  }

  @Get()
  getUser(@GetUser() user: User) {
    return this.Response(user);
  }

  @Put()
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: './uploads', // Especifica la carpeta donde se guardarán los archivos
        filename: (req, file, cb) => {
          // Genera un nombre de archivo único
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          console.log('file', file);
          const extArray = file.mimetype.split('/');
          const extension = extArray[extArray.length - 1];
          // const ext = extname(file.originalname);
          const filename = `${uniqueSuffix}.${extension}`;
          cb(null, filename);
        },
      }),
    }),
  )
  async update(
    @GetUser() user: User,
    @Body() dto: UpdateUserDto,
    @UploadedFile() avatar: Express.Multer.File,
  ) {
    console.log('aca entro con el avatar', avatar);
    const result = await this.service.update(user, dto, avatar);
    return this.Response(result);
  }
}
