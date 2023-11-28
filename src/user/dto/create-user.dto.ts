import { IsEmail, IsString, IsStrongPassword, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(2)
  firstName: string;

  @IsString()
  @Length(2)
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  @Length(5, 20)
  username: string;

  @IsString()
  @IsStrongPassword({ minLength: 6 })
  password: string;
}
