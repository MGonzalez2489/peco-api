import { DataSource } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import configuration from '../config/configuration';

const options: MysqlConnectionOptions & SeederOptions = {
  type: 'mysql',
  ...configuration().database,
};

export const PecoDataSource = new DataSource(options);
