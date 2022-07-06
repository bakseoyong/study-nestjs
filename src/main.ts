import { Sse, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './utils/swagger';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Observable } from 'rxjs';

async function bootstrap() {
  //const app = await NestFactory.create(AppModule);
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Activate Cors
  app.enableCors({
    origin: '*',
    methods: 'GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS',
    optionsSuccessStatus: 200,
  });

  //Custom ValidationPipe
  app
    .useGlobalPipes
    // new ValidationPipe({
    //   /**
    //    * whitelist: Exclude data that not defined in DTO
    //    * forbidNonWhitelisted: Throw Error when reqeust data that not defined in DTO
    //    * transfrom: JavaScript object to DTO object
    //    * disableErrorMessages: Disable Error Message
    //    */
    //   whitelist: true,
    //   forbidNonWhitelisted: true,
    //   transform: true,
    //   disableErrorMessages: true,
    // }),
    ();

  //Socket.io
  app.useWebSocketAdapter(new IoAdapter(app));

  //Swagger
  setupSwagger(app);

  //EJS
  app.useStaticAssets(join(__dirname, '..', 'src', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'src', 'views'));
  app.setViewEngine('ejs');

  await app.listen(3000);
}
bootstrap();
