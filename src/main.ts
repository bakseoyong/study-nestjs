import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './utils/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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

  //Swagger
  setupSwagger(app);

  await app.listen(3000);
}
bootstrap();
