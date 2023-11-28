import { Module } from '@nestjs/common';
import { EventAttendeesService } from './event-attendees.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendee } from './entities/attendee.entity';
import { EventAttendeesController } from './event-attendees.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Attendee])],
  controllers: [EventAttendeesController],
  providers: [EventAttendeesService],
  exports: [EventAttendeesService],
})
export class EventAttendeesModule {}
