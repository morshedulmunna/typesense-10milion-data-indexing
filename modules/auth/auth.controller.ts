import { FastifyReply } from 'fastify';
import { Body, Controller, Post, Res } from '@nestjs/common';
import { ErrorException } from '@app/error-exception';
import { EmailVerifyService } from './services/EmailVerify.service';
import { regenerateOtp, registerDto, verifyEmailDTO } from './dto/index.dto';
import { RegistrationService } from './services/Registration.service';
import { Public } from './auth-decorator/public.decorator';
import { RegenerateOtService } from './services/RegenerateOTP';
import { GetToken } from './auth-decorator/get-auth-token.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly emailVerifyService: EmailVerifyService,
    private readonly RegistrationService: RegistrationService,
    private readonly regenerateOtpService: RegenerateOtService,
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
    try {
      return this.RegistrationService.registration(register_info, response);
    } catch (error) {
      throw new ErrorException(error.message);
    }
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
    try {
      return this.regenerateOtpService.regenerateOtp(forVerificationEmail);
    } catch (error) {
      throw new ErrorException(error.message);
    }
  }

  /**
   *
   * After Register Verify Email.
   *
   */
  @Post('email-verify')
  async emailVerify(@Body() otp: verifyEmailDTO, @GetToken() token: string) {
    try {
      return this.emailVerifyService.emailVerify(otp, token);
    } catch (error) {
      throw new ErrorException(error.message);
    }
  }
}
