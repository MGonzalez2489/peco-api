import { ConfigNameEnum } from '@config/config-name.enum';
import { IAssetsConfiguration } from '@config/iConfiguration.interface';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import { join } from 'path';

@Injectable()
export class StorageService {
  constructor(private readonly configService: ConfigService) {}
  deleteUploadFile(fileName: string) {
    const assetsConfig = this.configService.get<IAssetsConfiguration>(
      ConfigNameEnum.assets,
    );

    //format file and clean possible double matches
    fileName = fileName.replace(global.appUrl, '');
    fileName = fileName.replace(assetsConfig!.assetsPath, '');
    fileName = fileName.replace(assetsConfig!.uploadsPath, '');

    //detect original route
    const destination = join(
      __dirname,
      '../',
      '../',
      assetsConfig!.rootPath,
      assetsConfig!.assetsPath,
      assetsConfig!.uploadsPath,
      fileName,
    );

    fs.unlink(destination, (err) => {
      if (err) {
        console.error(err);
        return;
      }
    });
  }
}
