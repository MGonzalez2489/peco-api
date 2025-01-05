import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/services';
import { Category, User } from 'src/datasource/entities';
import { Repository } from 'typeorm';
import { CategoryCreateDto } from '../dto';
import { PageOptionsDto } from 'src/common/dtos/pagination';

@Injectable()
export class CategoriesService extends BaseService<Category> {
  constructor(
    @InjectRepository(Category)
    protected readonly repository: Repository<Category>,
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

  async getByPublicId(catId: string, user: User): Promise<Category | null> {
    return await this.repository.findOneBy({
      publicId: catId,
      userId: user.id,
    });
  }

  async createCategory(
    categoryDto: CategoryCreateDto,
    user: User,
    isDefault: boolean = false,
  ): Promise<Category | null> {
    let parentCat: Category;
    if (categoryDto.parentId) {
      parentCat = await this.getByPublicId(categoryDto.parentId, user);
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
