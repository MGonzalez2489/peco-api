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
    origin: ['http://localhost:4200', 'http://192.168.0.2:4200'],
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  });

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  // await app.listen(3000, '192.160.0.2');
  await app.listen(3000, '0.0.0.0', function () {
    console.log('listening on port 3000');
  });
  console.log('==========================================');
}
bootstrap();
