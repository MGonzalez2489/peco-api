import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  PageOptionsDto,
  PaginatedResponseDto,
} from 'src/common/dtos/pagination';
import { BaseService } from 'src/common/services';
import { User } from 'src/datasource/entities';
import { EntryCategory } from 'src/datasource/entities/economy';
import { Repository } from 'typeorm';
import {
  EntryCategoryCreateDto,
  EntryCategoryUpdateDto,
} from '../dto/entry-category.dto';

@Injectable()
export class EntryCategoryService extends BaseService<EntryCategory> {
  constructor(
    @InjectRepository(EntryCategory)
    protected readonly repository: Repository<EntryCategory>,
  ) {
    super(repository);
  }

  /**
   * Retrieves all categories for a user, including subcategories.
   *
   * @param user The user object.
   * @param pageOptions Page options for pagination.
   * @returns Categories with subcategories.
   */
  async getAllAsync(
    user: User,
    pageOptions: PageOptionsDto,
  ): Promise<PaginatedResponseDto<EntryCategory>> {
    const categories = await this.Search(pageOptions, { userId: user.id });

    categories.data = categories.data
      .filter((cat) => !cat.parentId)
      .map((cat) => ({
        ...cat,
        subCategories: categories.data.filter((c) => c.parentId == cat.id),
      }));

    return categories;
  }

  /**
   * Creates a new category for a user.
   *
   * @param user The user object.
   * @param createCategoryDto Category creation data.
   * @returns The created category.
   */
  async getByPublicIdAsync(
    catId: string,
    user: User,
  ): Promise<EntryCategory | null> {
    return await this.repository.findOneBy({
      publicId: catId,
      userId: user.id,
    });
  }

  /**
   * Creates a new category for a user.
   *
   * @param categoryDto Category creation data.
   * @param user The user object.
   * @param isDefault Whether the category is default.
   * @returns The created category, or null if not found.
   */
  async createCategory(
    categoryDto: EntryCategoryCreateDto,
    user: User,
    isDefault: boolean = false,
  ): Promise<EntryCategory | null> {
    const parentCategory = await this.getByPublicIdAsync(
      categoryDto.parentId,
      user,
    );

    const newCategory = this.repository.create({
      name: categoryDto.name,
      userId: user.id,
      parentId: parentCategory?.id,
      isDefault,
    });

    return await this.repository.save(newCategory);
  }

  async update(dto: EntryCategoryUpdateDto, categoryId: string) {
    const cat = await this.repository.findOneBy({ publicId: categoryId });
    await this.repository.save({
      id: cat.id,
      name: dto.name,
      isVisible: dto.isVisible,
    });
    return await this.repository.findOneBy({ publicId: categoryId });
  }
}
