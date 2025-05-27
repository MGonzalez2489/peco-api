import { AccountsModule } from '@accounts/accounts.module';
import { AuthModule } from '@auth/auth.module';
import { JwtAuthGuard } from '@auth/guards';
import { CatalogsModule } from '@catalogs/catalogs.module';
import { HttpLoggerMiddleware } from '@common/middlewares';
import { ConfigNameEnum } from '@config/config-name.enum';
import configuration from '@config/configuration';
import { IAssetsConfiguration } from '@config/iConfiguration.interface';
import { EntryModule } from '@entries/entry.module';
import { EntryCategoryModule } from '@entry-category/entry-category.module';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { UsersModule } from '@users/users.module';
import { join } from 'path';
import { PTypeOrmModule } from './datasource/typeorm.module';
import { StorageModule } from './modules/storage/storage.module';

const envFilePath = `${__dirname}/../../${process.env.NODE_ENV || ''}.env`;

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      ignoreEnvFile: false,
      envFilePath: [envFilePath],
      isGlobal: true,
    }),
    ServeStaticModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const assetsConfig = configService.get<IAssetsConfiguration>(
          ConfigNameEnum.assets,
        );
        const rootPath = join(
          __dirname,
          assetsConfig!.rootPath,
          assetsConfig!.assetsPath,
          // assetsConfig!.uploadsPath,
        );
        const serveRoot = join(
          '/',
          assetsConfig!.assetsPath,
          // assetsConfig!.uploadsPath,
        );
        console.log('Serving static files', serveRoot);
        return [
          {
            rootPath,
            serveRoot,
          },
        ];
      },
    }),
    PTypeOrmModule,
    StorageModule,
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
    consumer.apply(HttpLoggerMiddleware).forRoutes('*splat');
  }
}
