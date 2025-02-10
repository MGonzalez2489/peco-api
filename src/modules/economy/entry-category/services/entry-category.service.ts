import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/services';
import { User } from 'src/datasource/entities';
import { Repository } from 'typeorm';
import { PageOptionsDto } from 'src/common/dtos/pagination';
import { EntryCategory } from 'src/datasource/entities/economy';
import { EntryCategoryCreateDto } from '../dto/entry-category.dto';

@Injectable()
export class EntryCategoryService extends BaseService<EntryCategory> {
  constructor(
    @InjectRepository(EntryCategory)
    protected readonly repository: Repository<EntryCategory>,
  ) {
    super(repository);
  }

  async getAll(user: User, pageOptions: PageOptionsDto) {
    const categories = await this.Search(pageOptions, { userId: user.id });

    const organizedCatArray = [];
    categories.data.forEach((cat) => {
      if (!cat.parentId) {
        cat.subCategories = categories.data.filter(
          (f) => f.parentId === cat.id,
        );
        organizedCatArray.push(cat);
      }
    });

    categories.data = organizedCatArray;
    return categories;
  }

  async getByPublicIdAsync(
    catId: string,
    user: User,
  ): Promise<EntryCategory | null> {
    return await this.repository.findOneBy({
      publicId: catId,
      userId: user.id,
    });
  }

  async createCategory(
    categoryDto: EntryCategoryCreateDto,
    user: User,
    isDefault: boolean = false,
  ): Promise<EntryCategory | null> {
    let parentCat: EntryCategory;
    if (categoryDto.parentId) {
      parentCat = await this.getByPublicIdAsync(categoryDto.parentId, user);
    }

    const newCategory = this.repository.create({
      name: categoryDto.name,
      userId: user.id,
      parentId: parentCat?.id,
      isDefault,
    });

    return await this.repository.save(newCategory);
  }
}
