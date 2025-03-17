import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { AccountType } from './../../../datasource/entities/catalogs';

import * as AccountTypeSeed from './../seeds/account-type.seed.json';

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
