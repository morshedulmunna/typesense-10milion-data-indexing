import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { ErrorException } from 'src/libs/errors.exception';
import { registerDto } from './dto/auth.dto';
import { RegisterService } from './services/register.service';
import { FastifyReply } from 'fastify';
import { EmailVerifyService } from './services/email-validation.service';
import { Cookies } from 'src/libs/decorator/cookies.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerService: RegisterService,
    private readonly emailVerifyService: EmailVerifyService,
  ) {}
  /**
   *
   * register time send otp to user  for verify email is valid or not
   *
   */
  //   @Public()
  @Post('send-email-validation-code')
  @HttpCode(HttpStatus.OK)
  async registerSendOTP(
    @Body() register_info: registerDto,
    @Res({ passthrough: true }) response: FastifyReply,
  ): Promise<any> {
    try {
      return this.registerService.sendEmailValidationCode(
        register_info,
        response,
      );
    } catch (error) {
      throw new ErrorException(error);
    }
  }

  /**
   *
   * Email Verification service. in client come to OTP and checking is valid or not then return response
   *
   */
  //   @Public()
  @Post('verify-otp')
  @HttpCode(HttpStatus.CREATED)
  async verifyEmail(
    @Body() { otp }: { otp: string },
    @Res({ passthrough: true }) response: FastifyReply,
    @Cookies() { verification_token }: any,
  ) {
    try {
      return this.emailVerifyService.verifyEmail(
        otp,
        verification_token,
        response,
      );
    } catch (error) {
      return new ErrorException(error);
    }
  }

  /**
   *
   * Login Controller
   *
   */
  //   @Public()
  //   @Post('login')
  //   @HttpCode(HttpStatus.OK)
  //   async login(@Body() loginData: LoginDto): Promise<any> {
  //     if (!loginData.email && !loginData.phone) {
  //       throw new BadRequestException('Either email or phone must be provided');
  //     }
  //     return await this.loginService.loginTailor(loginData);
  //   }

  /**
   *
   * Log out service:-> when clicked log out just remove cookies
   *
   */
  //   @Get('logout')
  //   @HttpCode(HttpStatus.OK)
  //   async logout(@GetCurrentUser() user: { id: string }): Promise<{
  //     message: string;
  //   } | null> {
  //     return this.logoutService.logout(user.id);
  //   }

  /**
   *
   * when access token is invalid just refresh again for getting access token
   *
   */
  //   @Public()
  //   @UseGuards(RtGuard)
  //   @Get('refresh')
  //   @HttpCode(HttpStatus.OK)
  //   async refresh(
  //     @GetCurrentUser() user: { id: string; refresh_token: string },
  //   ): Promise<any> {
  //     return this.refreshTokenService.refreshToken(user.id, user.refresh_token);
  //   }
}
