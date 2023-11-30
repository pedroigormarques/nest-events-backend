import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Attendee } from './entities/attendee.entity';
import { EventAttendeesController } from './event-attendees.controller';
import { EventAttendeesResolver } from './event-attendees.resolver';
import { EventAttendeesService } from './event-attendees.service';

@Module({
  imports: [TypeOrmModule.forFeature([Attendee])],
  controllers: [EventAttendeesController],
  providers: [EventAttendeesService, EventAttendeesResolver],
  exports: [EventAttendeesService],
})
export class EventAttendeesModule {}
