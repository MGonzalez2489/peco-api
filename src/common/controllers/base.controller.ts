import { HttpStatus } from '@nestjs/common';
import { ResponseDto } from '../dtos/responses';

export class BaseController {
  Response<T>(data: T, statusCode?: HttpStatus) {
    const code = statusCode ? statusCode : HttpStatus.OK;
    return new ResponseDto(data, code);
  }
}
