import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class Token {
  constructor(partial: Partial<Token>) {
    Object.assign(this, partial);
  }

  @Field()
  token: string;
}
