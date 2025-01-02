import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { SetSwaggerConfig } from './config/swagger.config';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //swagger
  SetSwaggerConfig(app);
  //
  app.setGlobalPrefix('api');
  //
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  //
  app.enableCors({
    origin: ['http://localhost:4200'],
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  });

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  await app.listen(3000);
  console.log('==========================================');
}
bootstrap();
