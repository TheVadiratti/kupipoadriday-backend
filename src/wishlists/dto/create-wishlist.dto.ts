import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';

export class CreateWishlistDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(250)
  name: string;

  @IsUrl()
  image: string;

  @IsOptional()
  @IsArray()
  itemsId: number[];
}
