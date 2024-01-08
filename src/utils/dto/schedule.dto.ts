import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';

export class BookScheduleDto {
  @IsNotEmpty()
  timeType: string[];

  @IsNotEmpty()
  date: Date;

  @IsNumber()
  doctorId: number;
}
export class BookSchedulesDto {
  // @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => BookScheduleDto)
  readonly data: BookScheduleDto[];
}
