import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: any, res: any, next: (error?: any) => void) {
    // if (){
    //     next()
    // }else{
    //     throw new UnauthorizedException();
    // }
  }
}
