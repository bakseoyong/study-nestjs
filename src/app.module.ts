import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './configs/typeorm.config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { BoardModule } from './board/board.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeORMConfig),
    UserModule,
    AuthModule,
    BoardModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
