import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CryptService {
  /**
   * @param plainText NOT encrypted text to be compared
   *@param hashedText Encrypted text to be compared
   * // This function compares one not encrypted text vs one encrypted text to see if are equal
   */
  async compare(plainText: string, hashedText: string): Promise<boolean> {
    return await bcrypt.compare(plainText, hashedText);
  }

  /**
   *@param plainText Text to be encrypted
   * // This function will encrypt the value
   */
  async encryptText(plainText: string): Promise<string> {
    return bcrypt.hash(plainText, 10);
  }
}
