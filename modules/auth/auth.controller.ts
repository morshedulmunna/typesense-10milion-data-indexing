import { FastifyReply } from 'fastify';
import { Body, Controller, Post, Res } from '@nestjs/common';
import { ErrorException } from '@app/error-exception';
import { EmailVerifyService } from './services/EmailVerify.service';
import { registerDto } from './dto/index.dto';
import { RegistrationService } from './services/Registration.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly emailVerifyService: EmailVerifyService,
    private readonly RegistrationService: RegistrationService,
  ) {}

  /**
   *
   * -> Register
   *
   */
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
   * Block comment
   *
   */
  @Post('email-verify')
  async emailVerify(
    @Body() register_info: registerDto,
    @Res({ passthrough: true }) response: FastifyReply,
  ) {
    try {
      this.emailVerifyService.emailVerify(register_info, response);
    } catch (error) {
      throw new ErrorException(error.message);
    }
  }
}
