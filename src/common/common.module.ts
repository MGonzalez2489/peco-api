import { Module } from '@nestjs/common';
import { CryptService } from './services';

@Module({
  imports: [],
  providers: [CryptService],
  exports: [CryptService],
})
export class CommonModule {}
