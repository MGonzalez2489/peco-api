import { DataSource } from 'typeorm';
import { runSeeders, Seeder } from 'typeorm-extension';

import * as fs from 'fs/promises';
import * as path from 'path';

export class InitSeeder implements Seeder {
  public async run(dataSource: DataSource) {
    const seeders = await this.loadSeeders();

    console.log('seeders', seeders);

    await runSeeders(dataSource, { seeds: seeders });
  }

  private async loadSeeders(): Promise<any[]> {
    const seedersPath = path.join(__dirname, '../../../'); // Ajusta la ruta según sea necesario
    console.log('seedersPath', seedersPath);

    const seeders: any[] = [];
    await this.readDirectoryRecursively(seedersPath, seeders);

    console.log('seeders found', seeders.length);
    return seeders;
  }

  private async readDirectoryRecursively(
    dir: string,
    seeders: any[],
  ): Promise<void> {
    const files = await fs.readdir(dir, { withFileTypes: true });

    for (const file of files) {
      const filePath = path.join(dir, file.name);

      if (file.isDirectory()) {
        await this.readDirectoryRecursively(filePath, seeders); // Recurse into subdirectories
      } else if (
        file.isFile() &&
        file.name.endsWith('.seeder.ts') &&
        file.name !== 'init.seeder.ts'
      ) {
        try {
          const module = await import(filePath);
          const seeder = module.default;
          seeders.push(seeder);
        } catch (error) {
          console.error(`Error importing seeder ${filePath}:`, error);
        }
      }
    }
  }

  // private async loadSeeders(): Promise<any[]> {
  //   const seedersPath = path.join(`${__dirname}../../../`);
  //   console.log('seedersPath', seedersPath);
  //   const files = await fs.readdir(seedersPath);
  //   const seederFiles = files.filter(
  //     (f) => f.endsWith('.seeder.ts') && f !== 'init.seeder.ts',
  //   );
  //
  //   console.log('seederFiles', seederFiles.length);
  //   const seeders: any[] = [];
  //
  //   for (const file of seederFiles) {
  //     const module = await import(path.join(seedersPath, file));
  //     const seeder = module.default;
  //     seeders.push(seeder);
  //   }
  //
  //   return seeders;
  // }
}
