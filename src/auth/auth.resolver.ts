import { LoginDto } from './dto/login.dto';
import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { Token } from './token.entity';
import { AuthService } from './auth.service';

@Resolver(() => Token)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => Token)
  public async login(@Args('input') loginDto: LoginDto): Promise<Token> {
    const user = await this.authService.validateUserCredentials(
      loginDto.username,
      loginDto.password,
    );

    return new Token({
      token: this.authService.generateToken(user),
    });
  }
}
