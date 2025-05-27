import { IsString } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  firstName?: string;

  @IsString()
  lastName?: string;

  @IsString()
  dateOfBirth?: string;

  // @IsString()
  // avatar?: File;
}
