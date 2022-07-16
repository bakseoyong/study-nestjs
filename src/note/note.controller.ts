import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateNoteDto } from './dto/create-note.dto';
import { NoteService } from './note.service';

@Controller('note')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}
  //첫번째 쪽지를 보내면서 방 생성이 시작됨.
  //=> 쪽지 보내기랑 답변 보내기를 따로 해야된다. 하지만 쪽지 보내기를 또 쓸 수 있다. 그러면 쪽지보내기는 답변 보내기까지 포함하고있어야한다.
  //   하지만 답변 보내기는 쪽지 보내기를 포함하면안된다. 왜냐하면 쪽지를 보낼때마다 방 생성 여부를 확인하기는 부담이다.
  //   하지만 둘 다 방을 없앤경우는? 그런 경우는 쪽지보내기를 할 경우 다시 방일 생길 것이고, 답변 보내기는 방이 없어져서 보내지 못한다.

  // @Get('/spend-note')
  // @UseGuards(JwtAuthGuard)
  // createNote(
  //   @Req() req,
  //   @Body() createNoteDto: CreateNoteDto,
  // ): Promise<Note[]> {
  //   return this.noteService.createNote(req.id, createNoteDto);
  // }

  //   @Get('/my-notes')
  //   @UseGuards(JwtAuthGuard)
  //   getNotesByUser(@Req() req): Promise<Note[]> {
  //     return this.noteService.getNotesByUser(userId);
  //   }
}
