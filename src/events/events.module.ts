import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Event } from './entities/event.entity';
import { EventsByUserController } from './events-by-user.controller';
import { EventsController } from './events.controller';
import { EventsResolver } from './events.resolver';
import { EventsService } from './events.service';

@Module({
  imports: [TypeOrmModule.forFeature([Event])],
  controllers: [EventsController, EventsByUserController],
  providers: [EventsService, EventsResolver],
})
export class EventsModule {}
