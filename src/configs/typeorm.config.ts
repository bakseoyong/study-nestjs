import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeORMConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: '127.0.0.1', //localhost -> Error : connect ECONNREFUSED
  port: 3306,
  username: 'root',
  password: 'root',
  database: 'board',
  entities: ['dist/**/*.entity{.ts,.js}'], // Throw error if delete '.js'
  synchronize: true,
};
