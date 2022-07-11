import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Follow } from './follow.entity';

export enum Role {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  STAFF = 'STAFF',
  MEMBER = 'MEMEBER',
}

@Entity({ name: 'users' })
@Unique(['id'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.MEMBER,
  })
  role: Role;

  @Column({ type: 'varchar', length: 12, unique: true, comment: 'Id' })
  uid: string;

  @Column({ type: 'varchar', length: 65, comment: 'Password' })
  password: string;

  @Column({
    type: 'varchar',
    length: 30,
    unique: true,
    comment: 'Email Address',
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 15,
    nullable: true,
    comment: 'Phone Number',
  })
  phone: string;

  @CreateDateColumn({ name: 'created', comment: 'Created Date' })
  created: Date;

  @UpdateDateColumn({ name: 'updated', comment: 'Updated Date' })
  updated: Date;

  @DeleteDateColumn({ name: 'deleted', comment: 'Deleted Date' })
  deleted: Date;

  // @ManyToMany((type) => User, (user) => user.follower)
  // @JoinTable()
  // following: User[];

  @OneToMany((type) => Follow, (follow) => follow.to)
  followings: Follow[];

  @OneToMany((type) => Follow, (follow) => follow.from)
  followers: Follow[];

  // @ManyToMany((type) => User, (user) => user.following)
  // @JoinTable()
  // follower: User[];
}
