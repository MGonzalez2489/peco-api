import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/services';
import { AccountType, EntryType } from 'src/datasource/entities/catalogs';
import { Repository } from 'typeorm';

//seed
import * as AccountTypeSeed from './../seeds/account-type.seed.json';
import * as EntryTypeSeed from './../seeds/entry-type.seed.json';

@Injectable()
export class CatalogsService extends BaseService<any> {
  constructor(
    @InjectRepository(AccountType)
    protected readonly catAccountTypeRepo: Repository<AccountType>,
    @InjectRepository(EntryType)
    protected readonly catEntryTypeRepo: Repository<EntryType>,
  ) {
    super();
  }

  async initCatalogs() {
    try {
      await this.EntryTypeSeed();
      await this.AccountTypeSeed();

      return true;
    } catch (error) {
      console.log('init catalogs', error.message);
      throw error;
    }
  }

  ///////////////////////////PRIVATE FUNCTIONS
  //Entry Type
  private async EntryTypeSeed() {
    for (let i = 0; i < EntryTypeSeed.length; i++) {
      const element = EntryTypeSeed[i];
      const alreadyExists = await this.catEntryTypeRepo.exists({
        where: { name: element.name },
      });

      if (!alreadyExists) {
        const newEntity = this.catEntryTypeRepo.create(element);
        await this.catEntryTypeRepo.save(newEntity);
      }
    }
  }
  //Account Type
  private async AccountTypeSeed() {
    for (let i = 0; i < AccountTypeSeed.length; i++) {
      const element = AccountTypeSeed[i];
      const alreadyExists = await this.catAccountTypeRepo.exists({
        where: { name: element.name },
      });

      if (!alreadyExists) {
        const newEntity = this.catAccountTypeRepo.create(element);
        await this.catAccountTypeRepo.save(newEntity);
      }
    }
  }
}
