import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
//seed
import * as EntryTypeSeed from './../seeds/entry-type.seed.json';
import { EntryType } from 'src/datasource/entities/catalogs';

@Injectable()
export class CatalogsService {
  constructor(
    @InjectRepository(EntryType)
    protected readonly catEntryTypeRepo: Repository<EntryType>,
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
  async getEntryByPublicId(publicId: string) {
    return await this.catEntryTypeRepo.findOneBy({ publicId });
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
