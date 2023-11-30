import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Exclude } from 'class-transformer';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Attendee } from './../../event-attendees/entities/attendee.entity';
import { Event } from './../../events/entities/event.entity';

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column()
  @Field()
  firstName: string;

  @Column()
  @Field()
  lastName: string;

  @Column({ unique: true })
  @Field()
  email: string;

  @Column({ unique: true })
  @Field()
  username: string;

  @Column()
  @Exclude()
  password: string;

  @OneToMany(() => Event, (event) => event.organizer)
  @Field(() => [Event])
  organized: Event[];

  @OneToMany(() => Attendee, (attendee) => attendee.user)
  @Exclude()
  @Field(() => [Attendee])
  attended: Attendee[];

  constructor(partial?: Partial<User>) {
    Object.assign(this, partial);
  }
}
