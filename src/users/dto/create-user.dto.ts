import {
  Length,
  IsEmail,
  IsNotEmpty,
  IsString,
  IsOptional,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 64)
  username: string;

  @IsString()
  @IsOptional()
  @Length(0, 200)
  about: string;

  @IsOptional()
  avatar: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}
