import { ConfigNameEnum } from '@config/config-name.enum';
import { IAssetsConfiguration } from '@config/iConfiguration.interface';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { diskStorage } from 'multer';
import { join } from 'path';

@Injectable()
export class StorageProvider {
  constructor(private readonly configService: ConfigService) {}

  getMulterStorage() {
    const assetsConfig = this.configService.get<IAssetsConfiguration>(
      ConfigNameEnum.assets,
    );

    const destination = join(
      __dirname,
      '../',
      '../',
      assetsConfig!.rootPath,
      assetsConfig!.assetsPath,
      assetsConfig!.uploadsPath,
    );

    return diskStorage({
      destination: destination,
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const extArray = file.mimetype.split('/');
        const extension = extArray[extArray.length - 1];
        const filename = `${uniqueSuffix}.${extension}`;
        cb(null, filename);
      },
    });
  }
}
