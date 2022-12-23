import { IsOptional, MaxLength, MinLength } from 'class-validator';

export class updateMeDto {
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
}
