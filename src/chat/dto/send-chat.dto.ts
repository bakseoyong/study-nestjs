import { CreateChatDto } from './create-chat.dto';

export class SendChatDto extends CreateChatDto {
  roomId: number;
}
