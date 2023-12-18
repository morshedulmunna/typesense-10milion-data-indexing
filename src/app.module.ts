import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypesenseModule } from './typesense/typesense.module';

@Module({
  imports: [TypesenseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
