import { Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { CurrentUser } from './current-user.decorator';
import { Token } from './token.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(AuthGuard('local'))
  login(@CurrentUser() user): Token {
    return new Token({ token: this.authService.generateToken(user) });
  }
}
