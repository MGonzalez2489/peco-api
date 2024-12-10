import { Global, Module } from '@nestjs/common';
import { databaseConfig } from 'src/config';
import { DataSource } from 'typeorm';

@Global()
@Module({
  imports: [],
  providers: [
    {
      provide: DataSource,
      inject: [],
      useFactory: async () => {
        const dbConfig = databaseConfig().database;
        console.log('db configuration ========', dbConfig);

        try {
          const dataSource = new DataSource({
            type: 'mysql',
            host: dbConfig.host,
            port: dbConfig.port,
            username: dbConfig.username,
            password: dbConfig.password,
            database: dbConfig.database,
            synchronize: dbConfig.synchronize,
            entities: [`${__dirname}/../**/**.entity{.ts,.js}`], // this will automatically load all entity file in the src folder
          });
          await dataSource.initialize(); // initialize the data source
          console.log('Database connected successfully');
          return dataSource;
        } catch (error) {
          console.log('Error connecting to database', error);
          throw error;
        }
      },
    },
  ],
  exports: [DataSource],
})
export class PTypeOrmModule {}
