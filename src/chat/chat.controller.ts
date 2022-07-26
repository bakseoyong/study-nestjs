import { Body, Controller, Delete, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateChatDto } from './dto/create-chat.dto';
import { ChatService } from './chat.service';
import { ChatListDto } from './dto/chat-list.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}
  //첫번째 쪽지를 보내면서 방 생성이 시작됨.
  //=> 쪽지 보내기랑 답변 보내기를 따로 해야된다. 하지만 쪽지 보내기를 또 쓸 수 있다. 그러면 쪽지보내기는 답변 보내기까지 포함하고있어야한다.
  //   하지만 답변 보내기는 쪽지 보내기를 포함하면안된다. 왜냐하면 쪽지를 보낼때마다 방 생성 여부를 확인하기는 부담이다.
  //   하지만 둘 다 방을 없앤경우는? 그런 경우는 쪽지보내기를 할 경우 다시 방일 생길 것이고, 답변 보내기는 방이 없어져서 보내지 못한다.

  @Get('/spend-chat')
  @UseGuards(JwtAuthGuard)
  createChat(@Req() req, @Body() createChatDto: CreateChatDto): void {
    return this.chatService.createChat(req.user.id, createChatDto);
  }

  @Get('/chat-list')
  @UseGuards(JwtAuthGuard)
  showChatList(@Req() req): Promise<ChatListDto[]> {
    return this.chatService.showChatList(req.user.id);
  }

  @Delete('/delete-chat')
  @UseGuards(JwtAuthGuard)
  deleteChat(@Req() req, chatId: number): Promise<boolean> {
    return this.chatService.deleteChat(req.user.id, chatId);
  }

  //   @Get('/my-notes')
  //   @UseGuards(JwtAuthGuard)
  //   getNotesByUser(@Req() req): Promise<Note[]> {
  //     return this.noteService.getNotesByUser(userId);
  //   }
}
