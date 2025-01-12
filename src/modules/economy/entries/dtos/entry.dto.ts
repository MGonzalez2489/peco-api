import { Entry } from 'src/datasource/entities/economy';

export class EntryDto {
  amount: number;
  publicId: string;
  description: string;
  category: string;
  type: string;
  createdAt: string;

  constructor(entry: Entry) {
    this.amount = entry.amount;
    this.publicId = entry.publicId;
    this.description = entry.description;
    this.category = entry.category?.name;
    this.type = entry.type?.displayName;
    this.createdAt = entry.createdAt;
  }
}
