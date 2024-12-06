import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { SetSwaggerConfig } from './config';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  let app = await NestFactory.create(AppModule);
  //swagger
  app = SetSwaggerConfig(app);
  //
  app.setGlobalPrefix('api');
  //
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  //
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  await app.listen(3000);
}
bootstrap();
