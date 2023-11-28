import { Exclude } from 'class-transformer';
import { Event } from './../../events/entities/event.entity';
import { User } from './../../user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum AttendeeAnswerEnum {
  Accepted = 1,
  Maybe,
  Rejected,
}

@Entity()
export class Attendee {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Event, (event) => event.attendees, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'eventId' })
  @Exclude()
  event: Event;

  @Column()
  @Exclude()
  eventId: number;

  @Column('enum', {
    enum: AttendeeAnswerEnum,
    default: AttendeeAnswerEnum.Accepted,
  })
  answer: AttendeeAnswerEnum;

  @ManyToOne(() => User, (user) => user.attended)
  user: User;

  @Column()
  @Exclude()
  userId: number;

  constructor(partial?: Partial<Attendee>) {
    Object.assign(this, partial);
  }
}
