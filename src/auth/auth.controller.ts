import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ErrorException } from 'src/libs/errors.exception';
import { registerDto } from 'src/types/auth.dto';

@Controller('auth')
export class AuthController {
  /**
   *
   * register time send otp to user  for verify email is valid or not
   *
   */
  //   @Public()
  @Post('register')
  @HttpCode(HttpStatus.OK)
  async registerSendOTP(@Body() register_info: registerDto): Promise<any> {
    try {
      //   return this.registerTailorService.registerSendOTP(registerData, response);
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
  async verifyEmail() {
    // @GetCookies() { verification_token }: any, // @Res({ passthrough: true }) response: Response, // @Body() OTP: string,
    try {
      //   return this.emailVerifyService.verifyEmail(OTP, verification_token);
    } catch (error) {
      throw new ErrorException(error);
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
