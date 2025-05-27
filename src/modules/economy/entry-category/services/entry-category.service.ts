import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { PageOptionsDto, PaginatedResponseDto } from '@common/dtos/pagination';
import { BaseService } from '@common/services';
import { User } from '@datasource/entities';
import { EntryCategory } from '@datasource/entities/economy';
import { Repository } from 'typeorm';
import {
  EntryCategoryCreateDto,
  EntryCategoryDto,
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
  ): Promise<PaginatedResponseDto<EntryCategoryDto>> {
    const filter = {};
    filter['userId'] = user.id;

    const query = this.repository.createQueryBuilder('category');
    query
      .leftJoinAndSelect('category.parent', 'parent')
      .leftJoinAndSelect('category.forType', 'forType')
      .where(filter)
      .orderBy(`category.name`, 'ASC');

    const response = await this.SearchByQuery(query, pageOptions);

    response.data = response.data
      .filter((cat: EntryCategory) => !cat.parentId)
      .map((f: EntryCategory) => {
        const dto = new EntryCategoryDto(f);
        dto.subCategories = response.data
          .filter((g: EntryCategory) => g.parentId === f.id)
          .map((h: EntryCategory) => new EntryCategoryDto(h));

        return dto;
      });

    return response;
  }

  /**
   * xx.
   *
   * @param user The user object.
   * @param createCategoryDto Category creation data.
   * @returns The created category.
   */
  async getByPublicIdAsync(
    catId: string,
    user: User,
  ): Promise<EntryCategory | null> {
    const result = await this.repository.findOne({
      where: { publicId: catId, userId: user.id },
      relations: ['parent'],
    });
    return result;
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
  ): Promise<EntryCategoryDto | null> {
    let parentCategory: EntryCategory | null = null;
    if (categoryDto.parentId) {
      parentCategory = await this.getByPublicIdAsync(
        categoryDto.parentId,
        user,
      );
    }
    let newCategory = this.repository.create({
      name: categoryDto.name,
      userId: user.id,
      parentId: parentCategory?.id,
      color: categoryDto?.color,
      icon: categoryDto?.icon,
      isDefault,
      forTypeId: categoryDto.forTypeId,
    });
    newCategory = await this.repository.save(newCategory);
    const result = await this.getByPublicIdAsync(newCategory.publicId, user);
    return new EntryCategoryDto(result!);
  }

  async update(
    dto: EntryCategoryUpdateDto,
    categoryId: string,
  ): Promise<EntryCategoryDto> {
    const cat = await this.repository.findOneBy({ publicId: categoryId });
    await this.repository.save({
      id: cat!.id,
      name: dto.name,
      isVisible: dto.isVisible,
    });
    const catEntity = await this.repository.findOneBy({ publicId: categoryId });

    return new EntryCategoryDto(catEntity!);
  }
}
