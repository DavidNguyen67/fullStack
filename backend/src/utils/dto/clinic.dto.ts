import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateClinicDTO {
  @IsNotEmpty()
  clinicId: string | number;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsString()
  contentMarkdown_VI: string;

  @IsNotEmpty()
  @IsString()
  contentMarkdown_EN: string;

  @IsNotEmpty()
  @IsString()
  descriptionHTML_VI: string;

  @IsNotEmpty()
  @IsString()
  descriptionHTML_EN: string;
}
