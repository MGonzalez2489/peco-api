/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import * as fs from 'fs';
import * as path from 'path';

function loadModelsFromDirectory(directoryPath: string): any[] {
  const modelClasses: any[] = [];

  // Read all files and directories in the given directory
  const items = fs.readdirSync(directoryPath);

  items.forEach((item) => {
    const fullPath: string = path.join(directoryPath, item);
    const stats = fs.statSync(fullPath);

    if (stats.isDirectory()) {
      // If the item is a directory, recursively load models from this directory
      modelClasses.push(...loadModelsFromDirectory(fullPath));
    } else if (
      item.endsWith('.dto.ts') ||
      item.endsWith('.dto.js') ||
      item.endsWith('.entity.ts') ||
      item.endsWith('.entity.js')
    ) {
      // If the item is a model file, dynamically import it
      const modelModule = require(fullPath);

      modelClasses.push(item);
      // Filter and add only classes that are decorated with @ApiProperty()
      Object.values(modelModule).forEach((item) => {
        modelClasses.push(item);
      });
    }
  });

  return modelClasses;
}

export function SetSwaggerConfig(app: INestApplication<any>): void {
  const config = new DocumentBuilder()
    .setTitle('Peco-Api')
    .setDescription('some description here')
    .setVersion('1.0')
    .build();

  const models = loadModelsFromDirectory(`${__dirname}/../`);
  const documentFactory = () =>
    SwaggerModule.createDocument(app, config, {
      extraModels: [...models],
    });

  SwaggerModule.setup('api', app, documentFactory);
}
