import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{11}$/, { message: 'cpf must contain exactly 11 digits' })
  cpf: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
