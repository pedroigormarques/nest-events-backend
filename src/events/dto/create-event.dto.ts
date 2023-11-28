import { IsString, IsDateString, Length } from 'class-validator';

export class CreateEventDto {
  @Length(1, 100)
  @IsString()
  name: string;
  @Length(1, 255)
  @IsString()
  description: string;
  @IsDateString()
  when: string;
  @Length(1, 255)
  @IsString()
  address: string;
}
