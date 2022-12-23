import { IsOptional, IsString } from 'class-validator';

export class updateVideoDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  link?: string;

  @IsString()
  @IsOptional()
  length?: string;

  @IsString()
  @IsOptional()
  extra?: string;
}
