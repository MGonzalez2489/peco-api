import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

import { EntryType } from '@datasource/entities/catalogs';
import { EntryTypeSeed } from './entry-type.seed';

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
