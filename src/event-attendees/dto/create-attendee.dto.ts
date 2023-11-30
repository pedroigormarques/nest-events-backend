import { Field, InputType } from '@nestjs/graphql';
import { IsEnum } from 'class-validator';

import { AttendeeAnswerEnum } from '../entities/attendee.entity';

@InputType()
export class CreateAttendeeDto {
  @IsEnum(AttendeeAnswerEnum)
  @Field(() => AttendeeAnswerEnum)
  answer: AttendeeAnswerEnum;
}
