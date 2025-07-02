import { SetSwaggerConfig } from '@config/swagger.config';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';

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

  app.enableCors();

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const testNwt = true;
  if (testNwt) {
    await app.listen(3000, '192.168.0.2');
  } else {
    await app.listen(3000, '0.0.0.0', function () {
      console.log('listening on port 3000');
    });
  }

  console.log('==========================================');
  const url = await app.getUrl();
  console.log('listen', url);
  global.appUrl = url;
}
void bootstrap();
