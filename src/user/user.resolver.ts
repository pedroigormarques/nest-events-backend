import { UseGuards } from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';

import { GqlCurrentUser } from './../auth/gql-current-user.decorator';
import { GqlAuthGuardJwt } from './../auth/guards/gql-auth-jwt.guard';
import { Attendee } from './../event-attendees/entities/attendee.entity';
import { Event } from './../events/entities/event.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => User, { name: 'myProfile' })
  @UseGuards(GqlAuthGuardJwt)
  me(@GqlCurrentUser() user: User): User {
    return user;
  }

  @Mutation(() => User, { name: 'createUser' })
  async create(@Args('input') createUserDto: CreateUserDto): Promise<User> {
    return await this.userService.create(createUserDto);
  }

  @ResolveField('attended', () => [Attendee])
  async loadAttended(@Parent() parent: User): Promise<Attendee[]> {
    const user = await this.userService.loadUserWithRelations(parent.id, [
      'attended',
    ]);

    return user.attended;
  }

  @ResolveField('organized', () => [Event])
  async loadOrganized(@Parent() parent: User): Promise<Event[]> {
    const user = await this.userService.loadUserWithRelations(parent.id, [
      'organized',
    ]);
    return user.organized;
  }
}
