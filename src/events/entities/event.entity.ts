import { Exclude } from 'class-transformer';
import { Attendee } from './../../event-attendees/entities/attendee.entity';
import { PaginationResult } from './../../pagination/pagination-result.entity';
import { User } from './../../user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ length: 100 })
  name: string;
  @Column()
  description: string;
  @Column()
  when: Date;
  @Column()
  address: string;

  @ManyToOne(() => User, (user) => user.organized, { nullable: false })
  @JoinColumn({ name: 'organizerId' })
  organizer: User;

  @Column()
  @Exclude()
  organizerId: number;

  @OneToMany(() => Attendee, (attendee) => attendee.event, {
    cascade: true,
  })
  attendees: Attendee[];

  attendeeCount?: number;
  attendeeRejected?: number;
  attendeeMaybe?: number;
  attendeeAccepted?: number;

  constructor(partial?: Partial<Event>) {
    Object.assign(this, partial);
  }
}

export type EventsPaginated = PaginationResult<Event>;
