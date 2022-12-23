import { IsIn, IsOptional, MaxLength, MinLength } from 'class-validator';
import { UserRoles } from '../roles.enum';

export class updateUserDto {
  @IsOptional()
  @MaxLength(20)
  @MinLength(3)
  username?: string;

  @IsOptional()
  @MaxLength(50)
  @MinLength(3)
  name?: string;

  @IsOptional()
  @MaxLength(50)
  @MinLength(2)
  surname?: string;

  @IsOptional()
  @IsIn([UserRoles.ADMIN, UserRoles.INSTRUCTOR, UserRoles.USER])
  role?: UserRoles;
}
