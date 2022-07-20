import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardModule } from 'src/board/board.module';
import { NotificationModule } from 'src/notification/notification.module';
import { CommentRepository } from 'src/repository/comment.repository';
import { UserModule } from 'src/user/user.module';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';

@Module({
  imports: [
    forwardRef(() => BoardModule),
    NotificationModule,
    UserModule,
    TypeOrmModule.forFeature([CommentRepository]),
  ],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
