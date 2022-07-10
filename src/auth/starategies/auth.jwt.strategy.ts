import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from '../constants';
import { Payload } from '../payloads/jwt.payload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // Setting how to extract JWT token at Request
      // -> insert JWT token at BearerToken from Authoriztion
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // False to delegate validation to Passport
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: Payload) {
    return { id: payload.id };
  }
}
