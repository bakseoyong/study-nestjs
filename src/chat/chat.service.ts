import { Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UserService } from 'src/user/user.service';
import { SendChatDto } from './dto/send-chat.dto';
import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import { ChatListDto } from './dto/chat-list.dto';
import { Room } from 'src/entity/room.entity';
import { UserActivityRepository } from 'src/repository/user-activity.repository';

@Injectable()
export class ChatService {
  constructor(
    private readonly userActivityRepository: UserActivityRepository,
    private readonly userService: UserService,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  createChat(userId: string, createChatDto: CreateChatDto): void {
    const roomId = +this.redis.get('existRoomsCnt') + 1;

    const { receiver, content } = createChatDto;
    //지역적 id 발생기
    const object = {
      id: 1,
      from: userId,
      to: receiver,
      content: content,
      created: new Date(),
    };

    //json to string
    this.redis.rpush(`chat:${roomId}`, JSON.stringify(object));

    this.userService.addChatRooms(userId, receiver, roomId);
  }

  sendChat(userId: string, sendChatDto: SendChatDto): void {
    //채팅을 보내려면 대화방 안에서 다음 primary키를 정해야 되고, 동시성 문제 해결해야한다.
    //유저 activity가 담고있는 rooms: room[]에서 찾기 가능.
    //room은 id랑 상대 user id담기. 그러면 id가 같은게 두개씩있으니까 primary키로 auto
    //increment 되는 키 하나더 만들고
    const { receiver, content, roomId } = sendChatDto;

    const object: object = {
      id: +this.redis.llen(`chat:${roomId}`) + 1,
      from: userId,
      to: receiver,
      content: content,
      created: new Date(),
    };

    this.redis.rpush(`chat:${roomId}`, JSON.stringify(object));
  }

  async showChatList(userId: string): Promise<ChatListDto[]> {
    const user = await this.userActivityRepository.findOne(userId);

    const rooms: Room[] = user.getChatRooms();

    const chatList: ChatListDto[] = [];
    for (const room of rooms) {
      const partner = room.partner;
      const parse = JSON.parse(this.redis.lrange(`chat:${room.id}`, -1, -1));
      const lastSended = parse.created;
      const lastContent = parse.content;
      const chat: ChatListDto = {
        partner: partner,
        lastSended: lastSended,
        lastContent: lastContent,
      };
      chatList.push(chat);
    }

    return chatList;
  }

  async deleteChat(userId: string, chatId: number): Promise<boolean> {
    const user = await this.userActivityRepository.findOne(userId);

    const rooms: Room[] = user.getChatRooms();

    const index = rooms.findIndex((element) => element.id === chatId);
    rooms.splice(index, 1);
    return true;
  }
}
