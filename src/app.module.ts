import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { IndexifyModule } from './indexify/indexify.module';

@Module({
  imports: [AuthModule, IndexifyModule],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
