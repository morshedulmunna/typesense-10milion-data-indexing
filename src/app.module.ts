import { Module } from '@nestjs/common';
import { TypesenseModule } from './Indexing/typesense.module';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [TypesenseModule, AuthModule],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
