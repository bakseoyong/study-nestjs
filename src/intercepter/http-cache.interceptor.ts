// import { CallHandler, ExecutionContext, Injectable } from '@nestjs/common';
// import { Observable, tap } from 'rxjs';
// import { CacheIntercepter } from './cache.interceptor';

// @Injectable()
// export class HttpCacheInterceptor extends CacheIntercepter {
//   private readonly CACHE_EVICT_METHODS = ['POST', 'PATCH', 'PUT', 'DELETE'];

//   async intercept(
//     context: ExecutionContext,
//     next: CallHandler<any>,
//   ): Promise<Observable<any>> {
//     const req = context.switchToHttp().getRequest<Request>();
//     if (this.CACHE_EVICT_METHODS.includes(req.method)) {
//       return next.handle().pipe(tap(() => this._clearCaches(req.originalUrl)));
//     }

//     return super.intercept(context, next);
//   }

//   private async _claerCaches(cacheKeys: string[]): Promise<boolean> {

//   }
// }
