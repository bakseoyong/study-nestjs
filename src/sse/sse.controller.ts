import {
  Controller,
  Get,
  Logger,
  Render,
  Req,
  Sse,
  UseGuards,
} from '@nestjs/common';
import { interval, map, Observable, of, ReplaySubject } from 'rxjs';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { SseService } from './sse.service';

@Controller('sse')
export class SseController {
  constructor(private readonly sseService: SseService) {}
  data: number[];

  @Get()
  @Render('sse.ejs')
  testSse(): void {
    const test = 1;
  }

  @Get('/new-event')
  newEvent(): void {
    this.sendAlarm(
      new Observable((subscriber) => {
        subscriber.next(1);
        subscriber.next(2);
        subscriber.next(3);
        setTimeout(() => {
          subscriber.next(4);
          subscriber.complete();
        }, 1000);
      }),
    );
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
  sendAlarm(a: Observable<any>): Observable<any> {
    //이벤트 모아놓은 스택 만들어서 어떻게 하기

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
    const observable = new Observable((subscriber) => {
      subscriber.next(1);
      subscriber.next(2);
      subscriber.next(3);
      setTimeout(() => {
        subscriber.next(4);
        subscriber.complete();
      }, 1000);
    });
    return observable;
    // return;
    // Logger.log(this.data);
    // return new Observable((subscriber) => {
    //   this.data.forEach((index) => {
    //     subscriber.next(index);
    //   });
    //   subscriber.complete();
    // }).pipe(
    //   map((num: number) => ({
    //     data: 'hello' + num,
    //   })),
    // );
    // return observable;
  }
}
