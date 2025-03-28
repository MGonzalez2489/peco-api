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
import { PlannedEntriesModule } from '@planned-entries/planned-entries.module';
import { UsersModule } from '@users/users.module';
import { PTypeOrmModule } from './datasource/typeorm.module';

const envFilePath = `${__dirname}/../../${process.env.NODE_ENV || ''}.env`;

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      ignoreEnvFile: false,
      envFilePath: [envFilePath],
      isGlobal: true,
    }),
    PTypeOrmModule,
    UsersModule,
    AccountsModule,
    EntryModule,
    EntryCategoryModule,
    CatalogsModule,
    AuthModule,
    PlannedEntriesModule,
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
