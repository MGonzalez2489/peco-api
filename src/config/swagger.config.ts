import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function SetSwaggerConfig(
  app: INestApplication<any>,
): INestApplication<any> {
  const config = new DocumentBuilder()
    .setTitle('Peco-Api')
    .setDescription('some description here')
    .setVersion('1.0')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, documentFactory);

  return app;
}
