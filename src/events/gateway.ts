import { Logger } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Like } from 'typeorm';

@WebSocketGateway(8080, {
  cors: {
    origin: '*',
  },
  namespace: 'board/view/:id',
})
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('ClientToServer')
  async handleMessage(@MessageBody() data) {
    this.server.emit('ServerToClient', data);
  }

  @SubscribeMessage('events')
  connectSomeone(@MessageBody() path: string) {
    Logger.log(path);
    this.server.emit('events', path);
  }

  @SubscribeMessage('board/view/:id')
  test(@MessageBody() path: string) {
    this.server.emit(path, path);
  }

  @SubscribeMessage('createRoom')
  test2(@MessageBody() path, @ConnectedSocket() client: Socket) {
    Logger.log(path.path);
    client.join(path.path);
    // client.to(path.path).emit('pressLikes', { path: path });
  }

  @SubscribeMessage('pressLikes')
  test3(@MessageBody() data, @ConnectedSocket() client: Socket) {
    //client.to(data.path).emit('pressLikes', { likes: data.likes });
    const likes = Number(data.likes) + 1;
    client.to(data.path).emit('pressLikes', { likes: likes });
  }
}
