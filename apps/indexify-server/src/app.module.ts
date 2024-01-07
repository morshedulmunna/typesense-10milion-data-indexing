import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from 'modules/auth/auth.module';
import { PostgresConfigModule } from 'config/postgres.config.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    PostgresConfigModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
