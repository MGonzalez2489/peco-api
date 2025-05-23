import { HttpStatus } from '@nestjs/common';
import { ResponseDto } from '../dtos/responses';

export class BaseController<T> {
  Response(data: any, statusCode?: HttpStatus): ResponseDto<T> {
    const code = statusCode ? statusCode : HttpStatus.OK;
    return new ResponseDto(data, code);
  }
}
