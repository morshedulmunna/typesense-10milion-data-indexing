import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { IndexifyModule } from './indexify/indexify.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { postgresConfig } from './config/postgresDB.config';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
      cache: true,
    }),
    AuthModule,
    IndexifyModule,
  ], //TypeOrmModule.forRoot(postgresConfig)
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
