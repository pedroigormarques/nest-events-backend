import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Exclude } from 'class-transformer';
import {
  Attendee,
  AttendeeAnswerEnum,
} from './../../event-attendees/entities/attendee.entity';
import { PaginationResult } from './../../pagination/pagination-result.entity';
import { User } from './../../user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  VirtualColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Event {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ length: 100 })
  name: string;

  @Field()
  @Column()
  description: string;

  @Field()
  @Column()
  when: Date;

  @Field()
  @Column()
  address: string;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.organized, { nullable: false })
  @JoinColumn({ name: 'organizerId' })
  @Exclude()
  organizer: User;

  @Column()
  @Exclude()
  organizerId: number;

  @OneToMany(() => Attendee, (attendee) => attendee.event, {
    cascade: true,
  })
  attendees: Attendee[];

  @VirtualColumn({
    query: (alias) =>
      `SELECT CASE WHEN ${alias}.id IS NOT NULL 
      THEN COUNT(*) ELSE NULL END 
      FROM attendee WHERE eventId=${alias}.id `,
  })
  @Field(() => Int)
  attendeeCount: number;

  @VirtualColumn({
    query: (alias) =>
      `SELECT CASE WHEN ${alias}.id IS NOT NULL 
      THEN COUNT(*) ELSE NULL END 
      FROM attendee WHERE eventId=${alias}.id AND answer=${AttendeeAnswerEnum.Rejected}`,
  })
  @Field(() => Int)
  attendeeRejected: number;

  @VirtualColumn({
    query: (alias) =>
      `SELECT CASE WHEN ${alias}.id IS NOT NULL 
      THEN COUNT(*) ELSE NULL END 
      FROM attendee WHERE eventId=${alias}.id AND answer=${AttendeeAnswerEnum.Maybe}`,
  })
  @Field(() => Int)
  attendeeMaybe: number;

  @VirtualColumn({
    query: (alias) =>
      `SELECT CASE WHEN ${alias}.id IS NOT NULL 
      THEN COUNT(*) ELSE NULL END 
      FROM attendee WHERE eventId=${alias}.id AND answer=${AttendeeAnswerEnum.Accepted}`,
  })
  @Field(() => Int)
  attendeeAccepted: number;

  constructor(partial?: Partial<Event>) {
    Object.assign(this, partial);
  }
}

@ObjectType()
export class EventsPaginated extends PaginationResult<Event>(Event) {}
