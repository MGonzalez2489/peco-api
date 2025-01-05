import { Inject, Injectable } from '@nestjs/common';
import { Category, User } from 'src/datasource/entities';
import { AccountService } from 'src/modules/accounts/services/account.service';

//seeds
import * as CatSeedData from './../seed/categories.seed.json';
import { CategoriesService } from 'src/modules/categories/services/categories.service';

//This service will seed all the default data for a new user
@Injectable()
export class UserSeedService {
  constructor(
    @Inject(AccountService) private readonly accountService: AccountService,
    @Inject(CategoriesService)
    private readonly userCatService: CategoriesService,
  ) {}

  async seed(user: User) {
    try {
      await this.accountService.createDefaultAccount(user);
      await this.seedCategories(CatSeedData, user);
    } catch (error) {
      throw error;
    }
  }

  private async seedCategories(source: any, user: User, parentCat?: Category) {
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
