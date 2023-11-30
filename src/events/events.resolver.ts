import { EventsService } from './events.service';
import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Event, EventsPaginated } from './entities/event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { GqlCurrentUser } from './../auth/gql-current-user.decorator';
import { User } from './../user/entities/user.entity';
import { UpdateGplEventDto } from './dto/update-event.dto';
import { Attendee } from './../event-attendees/entities/attendee.entity';
import { PaginateOptions } from './../pagination/pagination.dto';
import { GqlAuthGuardJwt } from './../auth/guards/gql-auth-jwt.guard';
import { UseGuards } from '@nestjs/common';

@Resolver(() => Event)
@UseGuards(GqlAuthGuardJwt)
export class EventsResolver {
  constructor(private readonly eventsService: EventsService) {}

  @Query(() => EventsPaginated, { name: 'getEvents' })
  async findAll(
    @Args('paginateOptions', { type: () => PaginateOptions, nullable: true })
    paginateOptions?: PaginateOptions,
  ): Promise<EventsPaginated> {
    const a = await this.eventsService.findAllPaginated(paginateOptions);
    return a;
  }

  @Query(() => Event, { name: 'getEvent' })
  async findOne(
    @Args('eventId', { type: () => Int }) id: number,
  ): Promise<Event> {
    return await this.eventsService.findOne(id);
  }

  @Query(() => EventsPaginated, { name: 'getEventsByOrganizer' })
  async findAllByOrganizer(
    @Args('userId', { type: () => Int }) userId: number,
    @Args('paginateOptions', { type: () => PaginateOptions, nullable: true })
    paginateOptions?: PaginateOptions,
  ): Promise<EventsPaginated> {
    return await this.eventsService.findAllByOrganizerPaginated(
      userId,
      paginateOptions,
    );
  }

  @Query(() => EventsPaginated, { name: 'getMyEvents' })
  async findAllOrganizerByMe(
    @GqlCurrentUser() user: User,
    @Args('paginateOptions', { type: () => PaginateOptions, nullable: true })
    paginateOptions?: PaginateOptions,
  ): Promise<EventsPaginated> {
    return await this.findAllByOrganizer(user.id, paginateOptions);
  }

  @Query(() => EventsPaginated, { name: 'getEventsAttendedByUser' })
  async findAllAttendedByUser(
    @Args('userId', { type: () => Int }) id: number,
    @Args('paginateOptions', { type: () => PaginateOptions, nullable: true })
    paginateOptions?: PaginateOptions,
  ): Promise<EventsPaginated> {
    return await this.eventsService.findAllByAttendedPaginated(
      id,
      paginateOptions,
    );
  }

  @Query(() => EventsPaginated, { name: 'getEventsAttendedByMe' })
  async findAllAttendedByMe(
    @GqlCurrentUser() user: User,
    @Args('paginateOptions', { type: () => PaginateOptions, nullable: true })
    paginateOptions?: PaginateOptions,
  ): Promise<EventsPaginated> {
    return await this.findAllAttendedByUser(user.id, paginateOptions);
  }

  @Mutation(() => Event, { name: 'createEvent' })
  async create(
    @Args('input', { type: () => CreateEventDto })
    createEventDto: CreateEventDto,
    @GqlCurrentUser() user: User,
  ): Promise<Event> {
    return await this.eventsService.create(createEventDto, user);
  }

  @Mutation(() => Event, { name: 'updateEvent' })
  async update(
    @Args('eventId', { type: () => Int }) id: number,
    @Args('input', { type: () => UpdateGplEventDto })
    updateEventDto: UpdateGplEventDto,
    @GqlCurrentUser() user: User,
  ): Promise<Event> {
    return await this.eventsService.update(id, updateEventDto, user);
  }

  @Mutation(() => Boolean, { name: 'removeEvent' })
  async remove(
    @Args('eventId', { type: () => Int }) id: number,
    @GqlCurrentUser() user: User,
  ): Promise<boolean> {
    await this.eventsService.remove(id, user);
    return true;
  }

  @ResolveField('organizer', () => User)
  async loadOrganizer(@Parent() parent: Event): Promise<User> {
    const event = await this.eventsService.loadEventWithRelations(parent.id, [
      'organizer',
    ]);

    return event.organizer;
  }

  @ResolveField('attendees', () => [Attendee])
  async loadAttendees(@Parent() parent: Event): Promise<Attendee[]> {
    const event = await this.eventsService.loadEventWithRelations(parent.id, [
      'attendees',
    ]);

    return event.attendees;
  }
}
