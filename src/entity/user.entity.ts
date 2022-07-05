import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

export enum Role {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  STAFF = 'STAFF',
  MEMBER = 'MEMEBER',
}

@Entity({ name: 'users' })
@Unique(['no'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  no: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.MEMBER,
  })
  role: Role;

  @Column({ type: 'varchar', length: 12, unique: true, comment: 'Id' })
  id: string;

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

  @ManyToMany((type) => User, (user) => user.follower)
  following: User[];

  @ManyToMany((type) => User, (user) => user.following)
  follower: User[];
}
