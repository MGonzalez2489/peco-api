import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/services';
import { AccountType, EntryType } from 'src/datasource/entities/catalogs';
import { Repository } from 'typeorm';

//seed

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
}
