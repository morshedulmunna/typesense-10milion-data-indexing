import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export default function swaggerConfig(app: INestApplication<any>) {
  const config = new DocumentBuilder()
    .setTitle('Indexify')
    .setDescription('Index your data & get search result so fast!')
    .setVersion('0.1')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('doc/api', app, document);
}
