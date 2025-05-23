import { AccountType } from '@datasource/entities/catalogs';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import * as AccountTypeSeed from './account-type.seed.json';

export default class AccountTypeSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const repo = dataSource.getRepository(AccountType);
    await Promise.all(
      AccountTypeSeed.map(async (entryTYpe: any) => {
        await repo.save(repo.create(entryTYpe));
      }),
    );
  }
}
