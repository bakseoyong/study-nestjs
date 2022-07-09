import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

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

  //알림 타입(작성한 게시글에 댓글 작성, 작성한 게시글에 좋아요, 팔로워한 유저의 새글 올림,
  //내가 작성한 댓글에 좋아요, 내가 작성한 댓글에 댓글)
  @Column({
    type: 'enum',
    enum: NotificationType,
  })
  notiType: NotificationType;

  @Column({ type: 'varchar', comment: 'alarm receiver' })
  receiver: string;

  @Column({ type: 'varchar', comment: 'alarm url' })
  url: string;

  @Column({ type: 'varchar', comment: 'alarm creator' })
  creator: string;

  @Column({ type: 'varchar', comment: 'alarm content' })
  content: string;

  @CreateDateColumn()
  created: Date;

  @Column({ type: 'boolean', comment: 'checked true / false' })
  checked: boolean;
}
