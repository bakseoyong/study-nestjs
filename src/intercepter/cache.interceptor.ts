import {
  CACHE_MANAGER,
  CACHE_TTL_METADATA,
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, of, tap } from 'rxjs';

const isNil = (val) => val === undefined || val === null;

@Injectable()
export class CacheIntercepter implements NestInterceptor {
  protected allowedMethods = ['GET'];
  constructor(
    @Inject(CACHE_MANAGER) protected readonly cacheManager: any,
    @Inject(Reflector) protected readonly reflector: any,
  ) {}

  trackBy(context: ExecutionContext): string | undefined {
    return 'key';
  }

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const key = this.trackBy(context);
    if (!key) return next.handle();

    try {
      //Check cached data
      const value = await this.cacheManager.get(key);
      //Response if there is cached data
      if (!isNil(value)) return of(value);

      const ttlValueOrFactory =
        this.reflector.get(CACHE_TTL_METADATA, context.getHandler()) ?? null;
      const ttl =
        typeof ttlValueOrFactory === 'function'
          ? await ttlValueOrFactory(context)
          : ttlValueOrFactory;
      return next.handle().pipe(
        tap((response) => {
          const args = isNil(ttl) ? [key, response] : [key, response, { ttl }];
          this.cacheManager.set(...args);
        }),
      );
    } catch {
      /*In case of an error during cache processing and cache inquiry,
      the business logic is processed as it is.*/
      return next.handle();
    }
  }
}
