import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from 'src/repository/user.repository';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(id: string, password: string): Promise<any> {
    const user = await this.userRepository.findByLogin(id, password);

    if (user) {
      const { password, ...result } = user;

      const accessToken = await this.jwtService.sign(result);

      result['token'] = accessToken;

      return result;
    }
    return null;
  }
}
