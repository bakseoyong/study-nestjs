import { BaseEntity, Entity, Unique } from 'typeorm';

@Entity({ name: 'rooms' })
@Unique(['id'])
export class Room extends BaseEntity {
  id: number;

  partner: string;

  static from(id: number, partner: string): Room {
    const room = new Room();
    room.id = id;
    room.partner = partner;
    return room;
  }
}
