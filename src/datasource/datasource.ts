import { DataSource } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';
import configuration from '../config/configuration';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';

const options: MysqlConnectionOptions & SeederOptions = {
  type: 'mysql',
  ...configuration().database,
};

export const PecoDataSource = new DataSource(options);
