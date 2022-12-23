import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class createVideoDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  link: string;

  @IsString()
  @IsNotEmpty()
  length: string;

  @IsString()
  @IsOptional()
  extra?: string;
}
