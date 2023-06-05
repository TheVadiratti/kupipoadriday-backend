import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';

export class CreateOfferDto {
  @Min(1)
  amount: number;

  @IsOptional()
  @IsBoolean()
  hidden: boolean;

  @IsNotEmpty()
  @IsNumber()
  itemId: number;
}
