import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CatEntryType } from 'src/datasource/entities/catalogs';
//seed
import * as EntryTypeSeed from './../seeds/entry-type.seed.json';

@Injectable()
export class CatalogsService {
  constructor(
    @InjectRepository(CatEntryType)
    protected readonly catEntryTypeRepo: Repository<CatEntryType>,
  ) {}

  async initCatalogs() {
    try {
      await this.EntryTypeSeed();

      return true;
    } catch (error) {
      console.log('init catalogs', error.message);
      throw error;
    }
  }

  async getEntryTypes() {
    return await this.catEntryTypeRepo.find();
  }

  ///////////////////////////PRIVATE FUNCTIONS
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
}
