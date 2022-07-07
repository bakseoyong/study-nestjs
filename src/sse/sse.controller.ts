import { Controller, Get, Render, Req, Sse, UseGuards } from '@nestjs/common';
import { interval, map, Observable, of, ReplaySubject } from 'rxjs';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { EventEmitter } from 'stream';
import { SseService } from './sse.service';

interface MessageEvent {
  type: string;
  message: string;
}

@Controller('sse')
export class SseController {
  constructor(private readonly sseService: SseService) {}

  @Get()
  @Render('sse.ejs')
  testSse(): void {
    const test = 1;
  }

  @Get('/login')
  @UseGuards(JwtAuthGuard)
  sseLogin(@Req() req): any {
    return req.user.no;
  }

  // @Get('/sse-noti-test')
  // async sseNotiTest(): Promise<any> {
  //   const author = '31fb5629-78e6-4d72-be48-2d23eabe32d5';
  //   const followers = ['c42a3872-a78b-4242-8428-bdc89a6b408b'];

  //   followers.map((follower) =>
  //     this.httpService.get(
  //       `http://localhost:3000/subscribe?userId=${follower}`,
  //     ),
  //   );
  // }

  @Sse('alarm')
  sendAlarm(): Observable<any> {
    const subject = new ReplaySubject();
    const observer = subject.asObservable();

    // return observer.pipe(
    //   map((num: number) => ({
    //     data: 'hello' + num,
    //   })),
    // );
    //return of({ type: 'new' }, { message: 'test' });
    //return of({ type: 'new board' }, { message: 'test' });
    // return interval(1000).pipe(
    //   map((num: number) => ({
    //     data: 'hello ' + num,
    //   })),
    // );
    // this.sseService.emit({ a: 1, b: 2 });
    // return true;
    // const observable = new Observable((subscriber) => {
    //   // subscriber.next(1);
    //   // subscriber.next(2);
    //   // subscriber.next(3);
    //   setTimeout(() => {
    //     subscriber.next(4);
    //     subscriber.complete();
    //   }, 1000);
    // });
    // return;
    return new Observable((subscriber) => {
      subscriber.next(1);
      subscriber.next(2);
      subscriber.complete();
    }).pipe(
      map((num: number) => ({
        data: 'hello' + num,
      })),
    );
    // return observable;
  }

  // @Sse('/subscribe')
  // subscribe();
}
