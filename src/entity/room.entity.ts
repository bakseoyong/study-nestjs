import { BaseEntity, Column, Entity, PrimaryColumn, Unique } from 'typeorm';

@Entity({ name: 'rooms' })
@Unique(['id'])
export class Room extends BaseEntity {
  @PrimaryColumn()
  id: number;

  @Column({ type: 'varchar', comment: 'partner user id' })
  partner: string;

  static from(id: number, partner: string): Room {
    const room = new Room();
    room.id = id;
    room.partner = partner;
    return room;
  }
}
