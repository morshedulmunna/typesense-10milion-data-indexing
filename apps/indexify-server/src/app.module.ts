import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from 'modules/auth/auth.module';
import { PostgresConfigModule } from 'config/postgres.config.module';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'modules/auth/guards/Auth.guard';
import { CommonUtilityService } from 'modules/auth/utility-service/common-utility.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    AuthModule,
    PostgresConfigModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    // {
    //   provide: APP_FILTER,
    //   useClass: CustomExceptionFilter,
    // },
    CommonUtilityService,
  ],
})
export class AppModule {}
