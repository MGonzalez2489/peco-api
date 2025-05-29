import { BaseService } from '@common/services';
import { AccountType, EntryType } from '@datasource/entities/catalogs';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

//seed

@Injectable()
export class CatalogsService extends BaseService {
  constructor(
    @InjectRepository(AccountType)
    protected readonly catAccountTypeRepo: Repository<AccountType>,
    @InjectRepository(EntryType)
    protected readonly catEntryTypeRepo: Repository<EntryType>,
  ) {
    super();
  }
}
