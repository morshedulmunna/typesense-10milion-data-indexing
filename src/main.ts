import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import swaggerConfig from './config/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  // Swagger Config
  swaggerConfig(app);
  await app.listen(5000);
}
bootstrap();
