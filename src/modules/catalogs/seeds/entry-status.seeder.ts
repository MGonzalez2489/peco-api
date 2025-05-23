import { EntryStatus } from '@datasource/entities/catalogs';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import * as EntryStatusSeed from './entry-status.seed.json';

export default class EntryStatusSeeder implements Seeder {
  public async run(dataSource: DataSource) {
    const repo = dataSource.getRepository(EntryStatus);

    await Promise.all(
      EntryStatusSeed.map(async (entryTYpe: any) => {
        await repo.save(repo.create(entryTYpe));
      }),
    );
  }
}
