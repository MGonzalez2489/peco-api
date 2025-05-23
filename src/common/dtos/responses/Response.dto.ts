import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class ResponseDto<T> {
  @ApiProperty()
  statusCode: HttpStatus;
  @ApiProperty()
  data: T;
  @ApiProperty()
  isSuccess: boolean;
  @ApiProperty()
  errorMessage?: string;

  constructor(_data: T, statusCode: HttpStatus, errorMessage?: string) {
    this.data = _data;
    this.isSuccess = true;
    this.statusCode = statusCode;
    if (errorMessage) {
      this.errorMessage = errorMessage;
      this.isSuccess = false;
    }
  }
}
