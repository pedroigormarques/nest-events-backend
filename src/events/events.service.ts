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
import { paginate } from './../pagination/paginate.function';
import { PickPropertiesByType } from './../utils/pick-properties-by-type.type';

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
        attendeeCount: 0,
        attendeeAccepted: 0,
        attendeeMaybe: 0,
        attendeeRejected: 0,
      }),
    );
  }

  async findAllPaginated(
    paginateOptions?: PaginateOptions,
  ): Promise<EventsPaginated> {
    return await paginate(
      this.getBaseQuery(),
      EventsPaginated,
      paginateOptions,
    );
  }

  async findAllByOrganizerPaginated(
    userId: number,
    paginateOptions?: PaginateOptions,
  ): Promise<EventsPaginated> {
    return await paginate(
      this.getBaseQuery().where('e.organizerId = :userId', {
        userId,
      }),
      EventsPaginated,
      paginateOptions,
    );
  }

  async findAllByAttendedPaginated(
    userId: number,
    paginateOptions?: PaginateOptions,
  ): Promise<EventsPaginated> {
    return await paginate(
      this.getBaseQuery()
        .leftJoinAndSelect('e.attendees', 'a')
        .where('a.userId = :userId', { userId }),
      EventsPaginated,
      paginateOptions,
    );
  }

  async findOne(id: number): Promise<Event> {
    const event = await this.repository.findOne({ where: { id } });

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

  private getBaseQuery(): SelectQueryBuilder<Event> {
    return this.repository.createQueryBuilder('e').orderBy('e.id', 'DESC');
  }

  async loadEventWithRelations(
    userId: number,
    relations: Array<keyof PickPropertiesByType<Event, object>>,
  ): Promise<Event> {
    const relationsObject = {};
    relations.forEach((v) => (relationsObject[v] = true));

    return await this.repository.findOne({
      where: { id: userId },
      select: { id: true, ...relationsObject },
      relations: relationsObject,
    });
  }
}
