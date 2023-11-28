import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from './../auth/current-user.decorator';
import { AuthGuardJwt } from './../auth/guards/auth-jwt.guard';

import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { User } from './entities/user.entity';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.userService.create(createUserDto);
  }

  @Get('me')
  @UseGuards(AuthGuardJwt)
  async getProfile(@CurrentUser() user): Promise<User> {
    return user;
  }
}
