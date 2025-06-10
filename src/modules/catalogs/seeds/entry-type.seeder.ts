import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

import { EntryType } from '@datasource/entities/catalogs';
import { EntryTypeSeed } from './entry-type.seed';

export default class EntryTypeSeeder implements Seeder {
  public async run(dataSource: DataSource) {
    const repo = dataSource.getRepository(EntryType);

    const types = repo.create(EntryTypeSeed);
    await repo.save(types);

    // await Promise.all(
    //   EntryTypeSeed.map(async (entryTYpe: any) => {
    //     await repo.save(repo.create(entryTYpe));
    //   }),
    // );
  }
}
