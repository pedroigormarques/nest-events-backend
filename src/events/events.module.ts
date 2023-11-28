import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { Event } from './entities/event.entity';
import { EventsByUserController } from './events-by-user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Event])],
  controllers: [EventsController, EventsByUserController],
  providers: [EventsService],
})
export class EventsModule {}
