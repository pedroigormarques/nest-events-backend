import { Type } from '@nestjs/common';
import { Field, Int, ObjectType } from '@nestjs/graphql';

export function PaginationResult<T>(classRef: Type<T>) {
  @ObjectType()
  class Pagination<T> {
    constructor(partial: Partial<Pagination<T>>) {
      Object.assign(this, partial);
    }
    @Field(() => [classRef])
    data: T[];

    @Field(() => Int)
    first: number;

    @Field(() => Int)
    last: number;

    @Field(() => Int)
    limit: number;

    @Field(() => Int)
    total: number;
  }

  return Pagination<T>;
}
