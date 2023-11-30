import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuardJwt } from './../auth/guards/auth-jwt.guard';
import { EventsService } from './events.service';
import { PaginateOptions } from './../pagination/pagination.dto';
import { EventsPaginated } from './entities/event.entity';
import { CurrentUser } from './../auth/current-user.decorator';
import { User } from './../user/entities/user.entity';

@Controller('events-organized-by-user')
@UseGuards(AuthGuardJwt)
export class EventsByUserController {
  constructor(private readonly eventsService: EventsService) {}

  @Get('me')
  async findAllByMe(
    @CurrentUser() user: User,
    @Query() paginateOptions: PaginateOptions,
  ): Promise<EventsPaginated> {
    return await this.eventsService.findAllByOrganizerPaginated(
      user.id,
      paginateOptions,
    );
  }

  @Get(':userId')
  async findAll(
    @Param('userId', ParseIntPipe) userId: number,
    @Query() paginateOptions: PaginateOptions,
  ): Promise<EventsPaginated> {
    return await this.eventsService.findAllByOrganizerPaginated(
      userId,
      paginateOptions,
    );
  }
}
