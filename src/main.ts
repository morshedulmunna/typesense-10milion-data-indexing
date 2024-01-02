import { NestFactory, Reflector } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import swaggerConfig from './config/swagger.config';
import fastifyCookie from '@fastify/cookie';
import { ValidationPipe } from '@nestjs/common';
import { AuthGuard } from './libs/guard/auth.guard';

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

  // Retrieve Reflector and AuthGuard from the module context
  const reflector = app.get(Reflector);
  const authGuard = new AuthGuard(reflector);

  // Apply the AuthGuard globally
  app.useGlobalGuards(authGuard);

  // Swagger Config
  swaggerConfig(app);
  await app.listen(5000);
}
bootstrap();
