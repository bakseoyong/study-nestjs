import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { UserActivity } from './user-activity.entity';

export enum NotificationType {
  WRITE_BOARD_LIKES = 1,
  WRITE_BOARD_COMMENT = 2,
  FOLLWER_BOARD = 3,
  WRITE_COMMENT_LIKES = 4,
  WRITE_COMMENT_COMMENT = 5,
}

@Entity({ name: 'notifications' })
@Unique(['id'])
export class Notification extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: NotificationType,
  })
  notiType: NotificationType;

  @ManyToOne(
    (type) => UserActivity,
    (userActivity) => userActivity.notifications,
  )
  to: UserActivity;

  @Column({ type: 'varchar', comment: 'alarm url' })
  url: string;

  //UserActivity Entity가 어떤 알림을 생성했는지는 불필요.
  @Column({ type: 'varchar', comment: 'alarm creator' })
  from: string;

  @Column({ type: 'boolean', default: false, comment: 'is alarm read' })
  read: boolean;

  @Column({ type: 'varchar', comment: 'alarm content' })
  content: string;

  @CreateDateColumn()
  created: Date;
}
