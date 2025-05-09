import { AccountsModule } from '@accounts/accounts.module';
import { AuthModule } from '@auth/auth.module';
import { JwtAuthGuard } from '@auth/guards';
import { CatalogsModule } from '@catalogs/catalogs.module';
import { HttpLoggerMiddleware } from '@common/middlewares';
import configuration from '@config/configuration';
import { EntryModule } from '@entries/entry.module';
import { EntryCategoryModule } from '@entry-category/entry-category.module';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { UsersModule } from '@users/users.module';
import { join } from 'path';
import { PTypeOrmModule } from './datasource/typeorm.module';

const envFilePath = `${__dirname}/../../${process.env.NODE_ENV || ''}.env`;

const fPath = join(__dirname, '/../', '/../', 'uploads/');
console.log(fPath); //http://localhost:3000/test.jpeg

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      ignoreEnvFile: false,
      envFilePath: [envFilePath],
      isGlobal: true,
    }),
    //TODO: set path to the config service
    //TODO: design an static folder structure/strategy to separate uploads from app files
    ServeStaticModule.forRoot({
      rootPath: fPath,
      serveRoot: '/uploads/',
    }),
    PTypeOrmModule,
    UsersModule,
    AccountsModule,
    EntryModule,
    EntryCategoryModule,
    CatalogsModule,
    AuthModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(HttpLoggerMiddleware).forRoutes('*');
  }
}
