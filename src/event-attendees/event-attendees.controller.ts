import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuardJwt } from './../auth/guards/auth-jwt.guard';
import { EventAttendeesService } from './../event-attendees/event-attendees.service';
import { CreateAttendeeDto } from './dto/create-attendee.dto';
import { Attendee, AttendeesPaginated } from './entities/attendee.entity';
import { PaginateOptions } from './../pagination/pagination.dto';

@UseGuards(AuthGuardJwt)
@Controller('events/:eventId/attendees')
export class EventAttendeesController {
  constructor(private readonly attendeesService: EventAttendeesService) {}

  @Get()
  async findAll(
    @Param('eventId', ParseIntPipe) eventId: number,
    @Query() paginateOptions: PaginateOptions,
  ): Promise<AttendeesPaginated> {
    return await this.attendeesService.getAttendeesByEventId(
      eventId,
      paginateOptions,
    );
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
