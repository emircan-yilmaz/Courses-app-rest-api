import { IsArray, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class createCourseDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  description: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  short_description: string;

  @IsArray()
  @IsNotEmpty()
  learn: string[];

  @IsArray()
  @IsNotEmpty()
  requirements: string[];

  @IsString()
  @IsNotEmpty()
  preview: string;
}
