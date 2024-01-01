import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { IndexifyModule } from './indexify/indexify.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { postgresConfig } from './config/postgresDB.config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthEntity } from './auth/entity/authentity';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
      cache: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      password: 'password',
      username: 'postgres',
      entities: [AuthEntity],
      database: 'typesensdb',
      synchronize: true,
      logging: true,
    }),
    AuthModule,
    IndexifyModule,
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
