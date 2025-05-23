/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataSource } from 'typeorm';
import { runSeeders, Seeder } from 'typeorm-extension';

import * as fs from 'fs/promises';
import * as path from 'path';

export class InitSeeder implements Seeder {
  public async run(dataSource: DataSource) {
    const seeders = await this.loadSeeders();

    await runSeeders(dataSource, { seeds: seeders });
  }

  private async loadSeeders() {
    const seedersPath = path.join(__dirname, '../../../'); // Ajusta la ruta según sea necesario
    console.log('path', seedersPath);

    const seeders: any[] = [];
    await this.readDirectoryRecursively(seedersPath, seeders);

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
}
