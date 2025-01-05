import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PTypeOrmModule } from './datasource/typeorm.module';
import configuration from './config/configuration';
import { AccountsModule } from './modules/accounts/accounts.module';
import { UsersModule } from './modules/users/users.module';
import { EntriesModule } from './modules/entries/entries.module';
import { AuthModule } from './modules/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './modules/auth/guards';
import { HttpLoggerMiddleware } from './common/middlewares';
import { CatalogsModule } from './modules/catalogs/catalogs.module';
import { CategoriesModule } from './modules/categories/categories.module';

const envFilePath = `${__dirname}/config/${process.env.NODE_ENV || ''}.env`;

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      ignoreEnvFile: false,
      envFilePath: [envFilePath],
      isGlobal: true,
    }),
    PTypeOrmModule,
    AuthModule,
    AccountsModule,
    UsersModule,
    EntriesModule,
    CatalogsModule,
    CategoriesModule,
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
