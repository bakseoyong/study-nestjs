import { Injectable, Logger, NestMiddleware, Sse } from '@nestjs/common';
import { SseService } from 'src/sse/sse.service';

@Injectable()
export class SseMiddleware implements NestMiddleware {
  constructor(private readonly sseSerivce: SseService) {}

  @Sse('alarm')
  async use(req: any, res: any, next: (error?: any) => void) {
    // Logger.log('middleware');
    // this.sseSerivce.subscribe();
    next();
  }
}
