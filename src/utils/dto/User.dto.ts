import { Type } from 'class-transformer';
import {
  IsAlpha,
  IsArray,
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
  readonly email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(20)
  readonly password: string;

  @IsString()
  @IsAlpha()
  readonly firstName: string;

  @IsString()
  @IsAlpha()
  readonly lastName: string;

  @IsString()
  readonly address: string;

  @IsBoolean()
  readonly gender?: boolean;

  @IsString()
  readonly roleId?: string;

  @IsString()
  @IsNumberString()
  readonly phoneNumber?: string;

  @IsString()
  readonly positionId?: string;

  readonly image?: any;
  readonly updateAt?: any;
}
export class CreateUsersDto {
  // @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => CreateUserDto)
  readonly data: CreateUserDto[];
}
export class UpdateUserDto {
  @IsNotEmpty()
  id?: any;

  @IsEmail()
  readonly email?: string;

  @IsString()
  @MinLength(6)
  @MaxLength(20)
  readonly password?: string;

  @IsString()
  @IsAlpha()
  readonly firstName?: string;

  @IsString()
  @IsAlpha()
  readonly lastName?: string;

  @IsString()
  readonly address?: string;

  @IsBoolean()
  readonly gender?: boolean;

  @IsString()
  readonly roleId?: string;

  @IsString()
  @IsNumberString()
  readonly phoneNumber?: string;

  @IsString()
  readonly positionId?: string;

  readonly image?: any;
  readonly updateAt?: any;
}
export class UpdateDoctorDto extends UpdateUserDto {}

export class UpdateDoctorsDto {
  // @IsDefined()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateDoctorDto)
  readonly data: UpdateDoctorDto[];
}

export class UpdateUsersDto {
  // @IsDefined()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateUserDto)
  readonly data: UpdateUserDto[];
}
