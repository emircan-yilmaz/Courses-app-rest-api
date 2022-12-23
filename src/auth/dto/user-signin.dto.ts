import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class userSignInDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  @MinLength(3)
  username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
