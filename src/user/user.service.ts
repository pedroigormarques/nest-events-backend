import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PickPropertiesByType } from './../utils/pick-properties-by-type.type';
import { Repository } from 'typeorm';

import { AuthService } from './../auth/auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly repository: Repository<User>,
    private readonly authService: AuthService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    await this.verifyExistsUserWithEmailOrUsername(createUserDto);

    const user = await this.repository.save(
      new User({
        ...createUserDto,
        password: await this.authService.getHashPassword(
          createUserDto.password,
        ),
      }),
    );

    return user;
  }

  private async verifyExistsUserWithEmailOrUsername(
    createUserDto: CreateUserDto,
  ): Promise<void> {
    const response = await this.repository.find({
      where: [
        { username: createUserDto.username },
        { email: createUserDto.email },
      ],
    });

    if (response.length !== 0)
      throw new BadRequestException('Email or username is alredy taken');
  }

  async loadUserWithRelations(
    userId: number,
    relations: Array<keyof PickPropertiesByType<User, object>>,
  ): Promise<User> {
    const relationsObject = {};
    relations.forEach((v) => (relationsObject[v] = true));
    return await this.repository.findOne({
      where: { id: userId },
      select: { id: true, ...relationsObject },
      relations: relationsObject,
    });
  }
}
