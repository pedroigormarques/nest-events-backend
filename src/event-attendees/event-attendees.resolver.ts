import { UseGuards } from '@nestjs/common';
import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { GqlAuthGuardJwt } from './../auth/guards/gql-auth-jwt.guard';
import { Event } from './../events/entities/event.entity';
import { User } from './../user/entities/user.entity';

import { CreateAttendeeDto } from './dto/create-attendee.dto';
import { Attendee, AttendeesPaginated } from './entities/attendee.entity';
import { EventAttendeesService } from './event-attendees.service';
import { PaginateOptions } from './../pagination/pagination.dto';

@Resolver(() => Attendee)
@UseGuards(GqlAuthGuardJwt)
export class EventAttendeesResolver {
  constructor(private readonly eventAttendeesService: EventAttendeesService) {}

  @Query(() => AttendeesPaginated, { name: 'getAttendees' })
  async findAll(
    @Args('eventId', { type: () => Int }) eventId: number,
    @Args('paginateOptions', { type: () => PaginateOptions, nullable: true })
    paginateOptions?: PaginateOptions,
  ): Promise<AttendeesPaginated> {
    return await this.eventAttendeesService.getAttendeesByEventId(
      eventId,
      paginateOptions,
    );
  }

  @Query(() => Attendee, { name: 'getAttendee' })
  async findOne(
    @Args('eventId', { type: () => Int }) eventId: number,
    @Args('userId', { type: () => Int }) userId: number,
  ): Promise<Attendee> {
    return await this.eventAttendeesService.getAttendeeByEventIdAndUserId(
      eventId,
      userId,
    );
  }

  @Mutation(() => Attendee, { name: 'CreateOrUpdateAttendee' })
  async createOrUpdate(
    @Args('eventId', { type: () => Int }) eventId: number,
    @Args('userId', { type: () => Int }) userId: number,
    @Args('input', { type: () => CreateAttendeeDto }) data: CreateAttendeeDto,
  ): Promise<Attendee> {
    return await this.eventAttendeesService.CreateOrUpdateAttendee(
      data,
      eventId,
      userId,
    );
  }

  @ResolveField('user', () => User)
  async loadUser(@Parent() parent: Attendee): Promise<User> {
    const attendee = await this.eventAttendeesService.loadAttendeeWithRelations(
      parent.id,
      ['user'],
    );

    return attendee.user;
  }

  @ResolveField('event', () => Event)
  async loadEvent(@Parent() parent: Attendee): Promise<Event> {
    const attendee = await this.eventAttendeesService.loadAttendeeWithRelations(
      parent.id,
      ['event'],
    );

    return attendee.event;
  }
}
