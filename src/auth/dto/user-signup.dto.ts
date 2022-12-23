import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UserRoles } from '../../users/roles.enum';

export class userSignUpDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  @MinLength(3)
  username: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @MinLength(3)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @MinLength(2)
  surname: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  passwordConfirm: string;

  @IsOptional()
  @IsIn([UserRoles.ADMIN, UserRoles.INSTRUCTOR, UserRoles.USER])
  role?: UserRoles;
}
