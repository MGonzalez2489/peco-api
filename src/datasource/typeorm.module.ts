import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from 'src/common/common.module';
import { ConfigNameEnum } from 'src/config/config-name.enum';
import { IDatabaseConfiguration } from 'src/config/iConfiguration.interface';

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
