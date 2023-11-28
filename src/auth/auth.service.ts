import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { User } from '../user/entities/user.entity';

@Injectable()
export class AuthService {
  private readonly salt = 10;

  constructor(private readonly jwtService: JwtService) {}

  public generateToken(user: User): string {
    return this.jwtService.sign({
      sub: user.id,
      username: user.username,
    });
  }

  async getHashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, this.salt);
  }
}
