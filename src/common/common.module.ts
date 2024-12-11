import { Module } from '@nestjs/common';
import { BaseService, CryptService } from './services';

@Module({
  imports: [],
  providers: [CryptService, BaseService],
  exports: [CryptService, BaseService],
})
export class CommonModule {}
