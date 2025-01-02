import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { ConfigNameEnum } from 'src/config/config-name.enum';
import { IDatabaseConfiguration } from 'src/config/iConfiguration.interface';
import { CommonModule } from 'src/common/common.module';

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
