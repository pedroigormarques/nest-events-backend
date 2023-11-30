import { InputType, PickType } from '@nestjs/graphql';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@InputType()
export class LoginDto extends PickType(CreateUserDto, [
  'username',
  'password',
]) {}
