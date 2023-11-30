import { Field, InputType } from '@nestjs/graphql';
import { IsString, IsDateString, Length } from 'class-validator';

@InputType()
export class CreateEventDto {
  @Field()
  @Length(1, 100)
  @IsString()
  name: string;

  @Field()
  @Length(1, 255)
  @IsString()
  description: string;

  @Field()
  @IsDateString()
  when: string;

  @Field()
  @Length(1, 255)
  @IsString()
  address: string;
}
