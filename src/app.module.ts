import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { IndexifyModule } from './indexify/indexify.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { postgresConfig } from './config/postgresDB.config';

@Module({
  imports: [AuthModule, IndexifyModule, TypeOrmModule.forRoot(postgresConfig)],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
