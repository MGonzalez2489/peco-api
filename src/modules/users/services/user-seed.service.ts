import { Inject, Injectable } from '@nestjs/common';

import { AccountService } from '@accounts/services/account.service';
import { CatEntryTypeService } from '@catalogs/services';
import { User } from '@datasource/entities';
import { EntryCategoryDto } from '@entry-category/dto/entry-category.dto';
import { EntryCategoryService } from '@entry-category/services/entry-category.service';
import { CatSeedData } from '@users/seed/categories.seed';
//seeds

//This service will seed all the default data for a new user
@Injectable()
export class UserSeedService {
  constructor(
    @Inject(AccountService) private readonly accountService: AccountService,
    @Inject(EntryCategoryService)
    private readonly userCatService: EntryCategoryService,
    @Inject(CatEntryTypeService)
    private readonly catEntryTypeService: CatEntryTypeService,
  ) {}

  async seed(user: User) {
    await this.accountService.createRootAccountAsync(user);
    await this.seedCategories(CatSeedData, user);
  }

  private async seedCategories(
    source: unknown[],
    user: User,
    parentCat?: EntryCategoryDto,
  ) {
    const eTypes = await this.catEntryTypeService.getAllEntryTypes();

    for (let i = 0; i < source.length; i++) {
      const element = source[i];
      //parent
      const newCat = await this.userCatService.createCategory(
        {
          name: element.name,
          parentId: parentCat?.publicId,
          icon: element.icon,
          color: element.color,
          forTypeId: eTypes!.find((f) => f.name === element.forTypeId)!.id,
        },
        user,
        true,
      );
      //children
      if (element.subCategories) {
        await this.seedCategories(element.subCategories, user, newCat!);
      }
    }
  }
}
