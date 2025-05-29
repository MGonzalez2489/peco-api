import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { BaseService } from './base.service';

@Injectable()
export class CryptService extends BaseService {
  constructor() {
    super();
  }
  /**
   * @param plainText NOT encrypted text to be compared
   *@param hashedText Encrypted text to be compared
   * // This function compares one not encrypted text vs one encrypted text to see if are equal
   */
  compare(plainText: string, hashedText: string) {
    try {
      return bcrypt.compare(plainText, hashedText);
    } catch (error) {
      this.ThrowException('CryptService::compare', error);
    }
  }

  /**
   *@param plainText Text to be encrypted
   * // This function will encrypt the value
   */
  async encryptText(plainText: string) {
    try {
      return bcrypt.hash(plainText, 10);
    } catch (error) {
      this.ThrowException('CryptService::encryptText', error);
    }
  }
}
