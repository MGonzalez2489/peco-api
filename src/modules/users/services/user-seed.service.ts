import { Inject, Injectable } from '@nestjs/common';
import { User } from 'src/datasource/entities';

//seeds
import { AccountService } from 'src/modules/economy/accounts/services/account.service';
import { EntryCategoryDto } from 'src/modules/economy/entry-category/dto/entry-category.dto';
import { EntryCategoryService } from 'src/modules/economy/entry-category/services/entry-category.service';
import * as CatSeedData from './../seed/categories.seed.json';

//This service will seed all the default data for a new user
@Injectable()
export class UserSeedService {
  constructor(
    @Inject(AccountService) private readonly accountService: AccountService,
    @Inject(EntryCategoryService)
    private readonly userCatService: EntryCategoryService,
  ) {}

  async seed(user: User) {
    try {
      await this.accountService.createRootAccountAsync(user);
      await this.seedCategories(CatSeedData, user);
    } catch (error) {
      throw error;
    }
  }

  private async seedCategories(
    source: any,
    user: User,
    parentCat?: EntryCategoryDto,
  ) {
    for (let i = 0; i < source.length; i++) {
      const element = source[i];

      //parent
      const newCat = await this.userCatService.createCategory(
        { name: element.name, parentId: parentCat?.publicId },
        user,
        true,
      );
      //children
      if (element.subCategories) {
        await this.seedCategories(element.subCategories, user, newCat);
      }
    }
  }
}
