import { Type } from 'class-transformer';
import {
  IsAlpha,
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';

class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  readonly password: string;

  @IsNotEmpty()
  @IsString()
  @IsAlpha()
  readonly firstName: string;

  @IsNotEmpty()
  @IsString()
  @IsAlpha()
  readonly lastName: string;

  @IsString()
  @IsNotEmpty()
  readonly address: string;

  @IsBoolean()
  readonly gender?: boolean;

  @IsString()
  readonly roleId?: string;

  @IsString()
  @IsNumberString()
  readonly phoneNum?: string;

  @IsString()
  readonly positionId?: string;

  readonly image?: any;
  readonly updateAt?: any;
}

export class CreateUserDtos {
  // @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => CreateUserDto)
  readonly data: CreateUserDto[] | CreateUserDto;
}
