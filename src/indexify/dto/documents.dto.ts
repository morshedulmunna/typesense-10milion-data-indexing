import {
  IsString,
  IsArray,
  IsInt,
  IsUrl,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class bookDataDto {
  @IsString()
  title: string;

  @IsArray()
  @IsString({ each: true })
  authors: string[];

  @IsInt()
  publication_year: number;

  @IsString()
  @IsOptional()
  id: string;

  @IsNumber()
  average_rating: number;

  @IsUrl()
  image_url: string;

  @IsInt()
  ratings_count: number;
}
