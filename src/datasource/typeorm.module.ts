import { CommonModule } from '@common/common.module';
import { ConfigNameEnum } from '@config/config-name.enum';
import { IDatabaseConfiguration } from '@config/iConfiguration.interface';
import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const dbConfig = configService.get<IDatabaseConfiguration>(
          ConfigNameEnum.database,
        );
        return {
          type: 'mysql',
          ...dbConfig,
        };
      },
    }),

    CommonModule,
  ],
})
export class PTypeOrmModule {}
