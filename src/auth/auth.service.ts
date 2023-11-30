import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { User } from '../user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  private readonly salt = 10;

  constructor(
    @InjectRepository(User) private readonly repository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  public generateToken(user: User): string {
    return this.jwtService.sign({
      sub: user.id,
      username: user.username,
    });
  }

  async getHashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, this.salt);
  }

  public async validateUserCredentials(
    username: string,
    password: string,
  ): Promise<User> {
    const user = await this.repository.findOneBy({ username });

    if (!user) throw new UnauthorizedException();

    if (!(await bcrypt.compare(password, user.password)))
      throw new UnauthorizedException();

    return user;
  }
}
