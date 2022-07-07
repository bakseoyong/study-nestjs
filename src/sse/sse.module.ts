import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { SseService } from './sse.service';
import { SseController } from './sse.controller';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [EventEmitterModule.forRoot()],
  providers: [SseService],
  controllers: [SseController],
})
export class SseModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer
  //     .apply(SseMiddleware)
  //     .forRoutes({ path: 'sse', method: RequestMethod.GET });
  // }
}
