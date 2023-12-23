import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { TypesenseModule } from './typesense-client/typesense.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [TypesenseModule, AuthModule],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
