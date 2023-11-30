import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PickPropertiesByType } from './../utils/pick-properties-by-type.type';
import { Repository } from 'typeorm';

import { Attendee, AttendeesPaginated } from './entities/attendee.entity';
import { paginate } from './../pagination/paginate.function';
import { PaginateOptions } from './../pagination/pagination.dto';

@Injectable()
export class EventAttendeesService {
  constructor(
    @InjectRepository(Attendee)
    private readonly repository: Repository<Attendee>,
  ) {}
  async getAttendeesByEventId(
    eventId: number,
    paginateOptions?: PaginateOptions,
  ): Promise<AttendeesPaginated> {
    return await paginate(
      this.repository
        .createQueryBuilder('a')
        .orderBy('a.id', 'DESC')
        .where('a.eventId = :eventId', {
          eventId,
        }),
      AttendeesPaginated,
      paginateOptions,
    );
  }

  public async getAttendeeByEventIdAndUserId(
    eventId: number,
    userId: number,
  ): Promise<Attendee> {
    const attendee = await this.repository.findOne({
      where: { eventId, userId },
    });

    if (!attendee) throw new NotFoundException();

    return attendee;
  }

  public async CreateOrUpdateAttendee(
    data: any,
    eventId: number,
    userId: number,
  ): Promise<Attendee> {
    let attendee = await this.repository.findOne({
      where: { eventId, userId },
    });

    if (!attendee) {
      attendee = new Attendee({ eventId, userId });
    }

    attendee.answer = data.answer;

    return await this.repository.save(attendee);
  }

  async loadAttendeeWithRelations(
    userId: number,
    relations: Array<keyof PickPropertiesByType<Attendee, object>>,
  ): Promise<Attendee> {
    const relationsObject = {};
    relations.forEach((v) => (relationsObject[v] = true));

    return await this.repository.findOne({
      where: { id: userId },
      select: { id: true, ...relationsObject },
      relations: relationsObject,
    });
  }
}
