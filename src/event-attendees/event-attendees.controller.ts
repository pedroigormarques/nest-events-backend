import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuardJwt } from './../auth/guards/auth-jwt.guard';
import { EventAttendeesService } from './../event-attendees/event-attendees.service';
import { CreateAttendeeDto } from './dto/create-attendee.dto';
import { Attendee } from './entities/attendee.entity';

@UseGuards(AuthGuardJwt)
@Controller('events/:eventId/attendees')
export class EventAttendeesController {
  constructor(private readonly attendeesService: EventAttendeesService) {}

  @Get()
  async findAll(
    @Param('eventId', ParseIntPipe) eventId: number,
  ): Promise<Attendee[]> {
    return await this.attendeesService.getAttendeesByEventId(eventId);
  }

  @Get(':userId')
  async findOne(
    @Param('eventId', ParseIntPipe) eventId: number,
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<Attendee> {
    return await this.attendeesService.getAttendeeByEventIdAndUserId(
      eventId,
      userId,
    );
  }

  @Put(':userId')
  async createOrUpdate(
    @Param('eventId', ParseIntPipe) eventId: number,
    @Param('userId', ParseIntPipe) userId: number,
    @Body() data: CreateAttendeeDto,
  ): Promise<Attendee> {
    return await this.attendeesService.CreateOrUpdateAttendee(
      data,
      eventId,
      userId,
    );
  }
}
