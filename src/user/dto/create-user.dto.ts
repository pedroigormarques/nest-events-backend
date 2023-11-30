import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsString, IsStrongPassword, Length } from 'class-validator';

@InputType()
export class CreateUserDto {
  @IsString()
  @Length(2)
  @Field()
  firstName: string;

  @IsString()
  @Length(2)
  @Field()
  lastName: string;

  @IsEmail()
  @Field()
  email: string;

  @IsString()
  @Length(5, 20)
  @Field()
  username: string;

  @IsString()
  @IsStrongPassword({ minLength: 6 })
  @Field()
  password: string;
}
