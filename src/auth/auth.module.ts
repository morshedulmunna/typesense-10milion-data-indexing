import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { RegisterService } from './services/register.service';
import { AuthJwtService } from 'src/libs/auth-jwt.service';
import { Cookies } from 'src/libs/decorator/cookies.decorator';
import { EmailVerifyService } from './services/email-validation.service';
import { LoginService } from './services/login.service';
import { RefreshService } from './services/refreshToken.service';
import { Repository } from 'typeorm';
import { AuthEntity } from './entity/authentity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([AuthEntity])],
  controllers: [AuthController],
  providers: [
    RegisterService,
    AuthJwtService,
    EmailVerifyService,
    LoginService,
    RefreshService,
    Repository,
  ],
})
export class AuthModule {}
