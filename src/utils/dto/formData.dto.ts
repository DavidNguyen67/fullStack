import { IsEmail, IsNumberString, IsString } from 'class-validator';
import { IsFile, MaxFileSize, MemoryStoredFile } from 'nestjs-form-data';

export class FormDataSendRemedyDTO {
  // max 5mb
  @IsFile()
  @MaxFileSize(5e6)
  file: MemoryStoredFile;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  timeType: string;

  lang?: string;

  @IsNumberString()
  doctorId: string;

  @IsNumberString()
  patientId: string;

  @IsString()
  patientName: string;
}
