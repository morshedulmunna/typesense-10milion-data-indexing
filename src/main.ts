import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import swaggerConfig from './config/swagger.config';
import fastifyCookie from '@fastify/cookie';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  // Middle ware
  await app.register(fastifyCookie, {
    secret: process.env.COOKIES_SIGNATURE_SECRET, // for cookies signature
  });
  app.useGlobalPipes(new ValidationPipe());

  // Swagger Config
  swaggerConfig(app);
  await app.listen(5000);
}
bootstrap();
