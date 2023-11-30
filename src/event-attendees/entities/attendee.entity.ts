import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Exclude } from 'class-transformer';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Event } from './../../events/entities/event.entity';
import { User } from './../../user/entities/user.entity';
import { PaginationResult } from './../../pagination/pagination-result.entity';

export enum AttendeeAnswerEnum {
  Accepted = 1,
  Maybe,
  Rejected,
}

registerEnumType(AttendeeAnswerEnum, { name: 'attendeeAnswer' });

@Entity()
@ObjectType()
export class Attendee {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @ManyToOne(() => Event, (event) => event.attendees, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'eventId' })
  @Exclude()
  @Field(() => Event)
  event: Event;

  @Column()
  @Exclude()
  eventId: number;

  @Column('enum', {
    enum: AttendeeAnswerEnum,
    default: AttendeeAnswerEnum.Accepted,
  })
  @Field(() => AttendeeAnswerEnum)
  answer: AttendeeAnswerEnum;

  @ManyToOne(() => User, (user) => user.attended)
  @Field(() => User)
  user: User;

  @Column()
  @Exclude()
  userId: number;

  constructor(partial?: Partial<Attendee>) {
    Object.assign(this, partial);
  }
}

@ObjectType()
export class AttendeesPaginated extends PaginationResult<Attendee>(Attendee) {}
