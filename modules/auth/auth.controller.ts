import { FastifyReply } from 'fastify';
import { Body, Controller, Post, Res } from '@nestjs/common';
import { EmailVerifyService } from './services/EmailVerify.service';
import {
  loginDto,
  regenerateOtp,
  registerDto,
  verifyEmailDTO,
} from './dto/index.dto';
import { RegistrationService } from './services/Registration.service';
import { Public } from './auth-decorator/public.decorator';
import { RegenerateOtService } from './services/RegenerateOTP';
import { GetToken } from './auth-decorator/get-auth-token.decorator';
import { LoginService } from './services/Login.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly emailVerifyService: EmailVerifyService,
    private readonly RegistrationService: RegistrationService,
    private readonly regenerateOtpService: RegenerateOtService,
    private readonly loginService: LoginService,
  ) {}

  /**
   *
   * -> Register
   *
   */
  @Public()
  @Post('register')
  async register(
    @Body() register_info: registerDto,
    @Res({ passthrough: true }) response: FastifyReply,
  ) {
    return this.RegistrationService.registration(register_info, response);
  }

  /**
   *
   * Regenerate OTP with Verify Token when it's not verified or expired
   *
   */
  @Public()
  @Post('regenerate-otp')
  async regenerateOtp(
    @Body() forVerificationEmail: regenerateOtp,
    @Res({ passthrough: true }) response: FastifyReply,
  ) {
    return this.regenerateOtpService.regenerateOtp(forVerificationEmail);
  }

  /**
   *
   * After Register Verify Email.
   *
   */
  @Post('email-verify')
  async emailVerify(@Body() otp: verifyEmailDTO, @GetToken() token: string) {
    return this.emailVerifyService.emailVerify(otp, token);
  }
  /**
   *
   * User login Controller
   *
   */
  @Public()
  @Post('login')
  async login(@Body() loginInfo: loginDto) {
    return this.loginService.login(loginInfo);
  }
}
