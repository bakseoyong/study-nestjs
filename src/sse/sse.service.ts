import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { fromEvent, map, Observable, Subject } from 'rxjs';

@Injectable()
export class SseService {
  private events = new Subject();
  constructor(private emitter: EventEmitter2) {}

  //   subscribe() {
  //     return fromEvent(this.emitter, '/sse/alarm');
  //   }

  addEvent(event) {
    this.events.next(event);
  }

  sendEvents() {
    return this.events.asObservable();
  }

  async emit(data) {
    //this.emitter.
    Logger.log(this.emitter.eventNames());
    Logger.log(data);
    Logger.log(this.emitter.listeners('noti'));
    Logger.log(this.emitter.emit('noti.noti', 1, 2)); // Logger.log(this.emitter.emit('noti'));
  }

  //   subscribe() {
  //     //return fromEvent(this.emitter, 'noti');
  //     Logger.log('subscribe');
  //     this.emitter.on('noti.*', (value1, value2) => {
  //       console.log(value1, value2);
  //     });
  //   }
}
