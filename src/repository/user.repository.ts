import { NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { User } from 'src/entity/user.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(User) //@EntityRepository deprecated in typeorm@^0.3.6
export class UserRepository extends Repository<User> {
  async getById(id: string): Promise<User> {
    return this.getById(id);
  }

  async deleteUser(id: string): Promise<boolean> {
    try {
      const deleteUser = await this.delete(id);

      //deleteUser DeleteResult { raw : [], affected : 1 }
      if (deleteUser.affected === 0) {
        throw new NotFoundException('There is no user to delete');
      }

      return true;
    } catch (error) {
      throw new HttpException(
        {
          message: 'SQL Error',
          error: error.sqlMessage,
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }
}
