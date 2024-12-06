import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SetSwaggerConfig } from './config';

async function bootstrap() {
  let app = await NestFactory.create(AppModule);
  app = SetSwaggerConfig(app);
  await app.listen(3000);
}
bootstrap();
