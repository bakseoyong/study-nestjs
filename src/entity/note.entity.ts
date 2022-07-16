import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { BoardHashtag } from './board-hashtag.entity';
import { User } from './user.entity';

//NoSql
export class Note extends BaseEntity {
  creator: User;
  receiver: User;
  content: string;
}
