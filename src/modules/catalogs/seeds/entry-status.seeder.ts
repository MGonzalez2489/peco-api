import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { EntryStatus } from './../../../datasource/entities/catalogs';
import * as EntryStatusSeed from './../seeds/entry-status.seed.json';

export default class EntryStatusSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const repo = dataSource.getRepository(EntryStatus);

    await Promise.all(
      EntryStatusSeed.map(async (entryTYpe: any) => {
        await repo.save(repo.create(entryTYpe));
      }),
    );
  }
}
