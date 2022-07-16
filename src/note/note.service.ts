import { Injectable } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';

@Injectable()
export class NoteService {
  // createNote(userId: string, createNoteDto: CreateNoteDto): Promise<Note[]> {
  //   return this.noteRepository.createNote(userId);
  // }
}
