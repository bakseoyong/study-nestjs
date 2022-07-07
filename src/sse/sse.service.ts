import { Injectable } from '@nestjs/common';
import { fromEvent, Subject } from 'rxjs';
import { EventEmitter } from 'stream';

@Injectable()
export class SseService {
  private events = new Subject();
  private readonly emitter = new EventEmitter();

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
    this.emitter.emit('/sse/alarm', { data });
  }
}
