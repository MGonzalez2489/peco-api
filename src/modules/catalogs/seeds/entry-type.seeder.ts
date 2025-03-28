import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

import { EntryType } from '@datasource/entities/catalogs';
import * as EntryTypeSeed from './account-type.seed.json';

export default class EntryTypeSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const repo = dataSource.getRepository(EntryType);

    await Promise.all(
      EntryTypeSeed.map(async (entryTYpe: any) => {
        await repo.save(repo.create(entryTYpe));
      }),
    );
  }
}
