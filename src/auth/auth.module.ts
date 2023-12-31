import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { RegisterService } from './services/register.service';
import { AuthJwtService } from 'src/libs/auth-jwt.service';
import { Cookies } from 'src/libs/decorator/cookies.decorator';
import { EmailVerifyService } from './services/email-validation.service';

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [RegisterService, AuthJwtService, EmailVerifyService],
})
export class AuthModule {}
