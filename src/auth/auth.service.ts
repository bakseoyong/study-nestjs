import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserProfileRepository } from 'src/repository/user-profile.repository';
import { UserRepository } from 'src/repository/user.repository';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userProfileRepository: UserProfileRepository,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(id: string, password: string): Promise<any> {
    const user = await this.userProfileRepository.findByLogin(id, password);

    if (user) {
      const { password, ...result } = user;

      const accessToken = await this.jwtService.sign(result);

      result['token'] = accessToken;

      return result;
    }
    return null;
  }
}
