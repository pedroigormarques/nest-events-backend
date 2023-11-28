import { Injectable, NotFoundException } from '@nestjs/common';
import { Attendee } from './entities/attendee.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class EventAttendeesService {
  constructor(
    @InjectRepository(Attendee)
    private readonly repository: Repository<Attendee>,
  ) {}
  public async getAttendeesByEventId(eventId: number): Promise<Attendee[]> {
    return await this.repository.find({ where: { eventId } });
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
}
