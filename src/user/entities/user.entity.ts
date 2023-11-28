import { Exclude } from 'class-transformer';
import { Attendee } from './../../event-attendees/entities/attendee.entity';
import { Event } from './../../events/entities/event.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  username: string;

  @Column()
  @Exclude()
  password: string;

  @OneToMany(() => Event, (event) => event.organizer)
  organized: Event[];

  @OneToMany(() => Attendee, (attendee) => attendee.user)
  @Exclude()
  attended: Attendee[];

  constructor(partial?: Partial<User>) {
    Object.assign(this, partial);
  }
}
