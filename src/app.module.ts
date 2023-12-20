import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { TypesenseModule } from './typesense/typesense.module';

@Module({
  imports: [TypesenseModule],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
