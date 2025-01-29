import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
//seed
import * as EntryTypeSeed from './../seeds/entry-type.seed.json';
import { EntryType } from 'src/datasource/entities/catalogs';
import { BaseService } from 'src/common/services';
import { PageOptionsDto } from 'src/common/dtos/pagination';

@Injectable()
export class CatalogsService extends BaseService<any> {
  constructor(
    @InjectRepository(EntryType)
    protected readonly catEntryTypeRepo: Repository<EntryType>,
  ) {
    super();
  }

  async initCatalogs() {
    try {
      await this.EntryTypeSeed();

      return true;
    } catch (error) {
      console.log('init catalogs', error.message);
      throw error;
    }
  }

  async getEntryTypes(paginationDto: PageOptionsDto) {
    this.repository = this.catEntryTypeRepo;
    return this.Search(paginationDto, {});
    // return await this.catEntryTypeRepo.find();
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
