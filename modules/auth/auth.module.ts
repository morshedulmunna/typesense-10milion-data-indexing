import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthEntity } from './repository/auth.entity';
import { AuthRepository } from './repository/auth.repository';
import { EmailVerifyService } from './services/EmailVerify.service';
import { RegistrationService } from './services/Registration.service';
import { CommonUtilityService } from '@app/common-utility';
import { SendMailService } from '@app/send-mailer';
import { RegenerateOtService } from './services/RegenerateOTP';

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
  ],
})
export class AuthModule {}
