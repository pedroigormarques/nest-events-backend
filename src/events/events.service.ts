import { PaginateOptions } from './../pagination/pagination.dto';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './../user/entities/user.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';

import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event, EventsPaginated } from './entities/event.entity';
import { AttendeeAnswerEnum } from './../event-attendees/entities/attendee.entity';
import { paginate } from './../pagination/paginate.function';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly repository: Repository<Event>,
  ) {}

  async create(createEventDto: CreateEventDto, user: User): Promise<Event> {
    return await this.repository.save(
      new Event({
        ...createEventDto,
        when: new Date(createEventDto.when),
        organizer: user,
      }),
    );
  }

  async findAllPaginated(
    paginateOptions?: PaginateOptions,
  ): Promise<EventsPaginated> {
    return await paginate(
      this.getEventsWithAttendeeCountQuery(),
      paginateOptions,
    );
  }

  async findAllByOrganizerPaginated(
    userId: number,
    paginateOptions?: PaginateOptions,
  ): Promise<EventsPaginated> {
    return await paginate(
      this.getEventsWithAttendeeCountQuery().where('e.organizerId = :userId', {
        userId,
      }),
      paginateOptions,
    );
  }

  async findAllByAttendedPaginated(
    userId: number,
    paginateOptions?: PaginateOptions,
  ): Promise<EventsPaginated> {
    return await paginate(
      this.getEventsWithAttendeeCountQuery()
        .leftJoinAndSelect('e.attendees', 'a')
        .where('a.userId = :userId', { userId }),
      paginateOptions,
    );
  }

  async findOne(id: number): Promise<Event> {
    const event = await this.repository.findOne({
      where: { id },
      relations: ['organizer'],
    });

    if (!event) throw new NotFoundException();

    return event;
  }

  async update(
    id: number,
    updateEventDto: UpdateEventDto,
    user: User,
  ): Promise<Event> {
    const event = await this.repository.findOneBy({ id });

    if (!event) throw new NotFoundException();

    if (user.id !== event.organizerId) throw new ForbiddenException();

    return await this.repository.save(
      new Event({
        ...event,
        ...updateEventDto,
        when: updateEventDto.when ? new Date(updateEventDto.when) : event.when,
      }),
    );
  }

  async remove(id: number, user: User): Promise<void> {
    const event = await this.repository.findOneBy({ id });

    if (!event) throw new NotFoundException();

    if (user.id !== event.organizerId) throw new ForbiddenException();

    await this.repository.remove(event);
  }

  private getEventsWithAttendeeCountQuery(): SelectQueryBuilder<Event> {
    return this.repository
      .createQueryBuilder('e')
      .orderBy('e.id', 'DESC')
      .loadRelationCountAndMap('e.attendeeCount', 'e.attendees')
      .loadRelationCountAndMap(
        'e.attendeeAccepted',
        'e.attendees',
        'attendee',
        (qb) =>
          qb.where('attendee.answer = :answer', {
            answer: AttendeeAnswerEnum.Accepted,
          }),
      )
      .loadRelationCountAndMap(
        'e.attendeeMaybe',
        'e.attendees',
        'attendee',
        (qb) =>
          qb.where('attendee.answer = :answer', {
            answer: AttendeeAnswerEnum.Maybe,
          }),
      )
      .loadRelationCountAndMap(
        'e.attendeeRejected',
        'e.attendees',
        'attendee',
        (qb) =>
          qb.where('attendee.answer = :answer', {
            answer: AttendeeAnswerEnum.Rejected,
          }),
      );
  }
}
