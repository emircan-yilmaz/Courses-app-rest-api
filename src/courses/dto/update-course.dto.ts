import { IsArray, IsOptional, IsString, MaxLength } from 'class-validator';

export class updateCourseDto {
  @IsString()
  @IsOptional()
  @MaxLength(20)
  title?: string;

  @IsString()
  @IsOptional()
  @MaxLength(200)
  description?: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  short_description?: string;

  @IsArray()
  @IsOptional()
  learn?: string[];

  @IsArray()
  @IsOptional()
  requirements?: string[];

  @IsString()
  @IsOptional()
  preview?: string;
}
