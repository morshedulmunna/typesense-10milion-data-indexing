import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { RegisterService } from './services/register.service';
import { AuthJwtService } from 'src/libs/auth-jwt.service';
import { Cookies } from 'src/libs/decorator/cookies.decorator';
import { EmailVerifyService } from './services/email-validation.service';
import { LoginService } from './services/login.service';
import { RefreshService } from './services/refreshToken.service';
import { Repository } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogoutService } from './services/logout.service';
import { AuthEntity } from './entity/auth.entity';
import { RegenerateOTP } from './services/regenerate-otp.service';
import { CommonService } from 'src/libs/common.service';

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
    LogoutService,
    RegenerateOTP,
    CommonService,
  ],
})
export class AuthModule {}
