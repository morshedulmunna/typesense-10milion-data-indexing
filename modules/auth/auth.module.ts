import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthEntity } from './repository/auth.entity';
import { AuthRepository } from './repository/auth.repository';
import { EmailVerifyService } from './services/EmailVerify.service';
import { RegistrationService } from './services/Registration.service';

import { SendMailService } from '@app/send-mailer';
import { RegenerateOtService } from './services/RegenerateOTP';
import { CommonUtilityService } from './utility-service/common-utility.service';
import { LoginService } from './services/Login.service';
import { RefreshTokenService } from './services/RefreshToken.service';

@Module({
  imports: [TypeOrmModule.forFeature([AuthEntity])],
  controllers: [AuthController],
  providers: [
    EmailVerifyService,
    AuthRepository,
    RegistrationService,
    CommonUtilityService,
    SendMailService,
    RegenerateOtService,
    LoginService,
    RefreshTokenService,
  ],
})
export class AuthModule {}
