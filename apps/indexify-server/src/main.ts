import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import swaggerConfig from 'libs/config/swagger.config';

import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  // Swagger Config
  swaggerConfig(app);

  await app.listen(3000);
}
bootstrap();
