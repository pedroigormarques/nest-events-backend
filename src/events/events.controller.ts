import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from './../auth/current-user.decorator';
import { AuthGuardJwt } from './../auth/guards/auth-jwt.guard';
import { User } from './../user/entities/user.entity';

import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventsService } from './events.service';
import { PaginateOptions } from './../pagination/pagination.dto';
import { Event, EventsPaginated } from './entities/event.entity';

@Controller('events')
@UseGuards(AuthGuardJwt)
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  async create(
    @Body() createEventDto: CreateEventDto,
    @CurrentUser() user: User,
  ): Promise<Event> {
    return await this.eventsService.create(createEventDto, user);
  }

  @Get()
  async findAll(
    @Query() paginateOptions: PaginateOptions,
  ): Promise<EventsPaginated> {
    return await this.eventsService.findAllPaginated(paginateOptions);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Event> {
    return await this.eventsService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEventDto: UpdateEventDto,
    @CurrentUser() user: User,
  ): Promise<Event> {
    return await this.eventsService.update(id, updateEventDto, user);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ): Promise<void> {
    return await this.eventsService.remove(id, user);
  }
}
