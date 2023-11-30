import { IsOptional, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';
import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class PaginateOptions {
  @Field(() => Int, { defaultValue: 10 })
  @Type(() => Number)
  @IsPositive()
  @IsOptional()
  limit = 10;

  @Field(() => Int, { defaultValue: 1 })
  @Type(() => Number)
  @IsPositive()
  @IsOptional()
  currentPage = 1;
}
