import { ErrorException } from '@app/error-exception';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  //   @Public()
  @Post('send-email-validation-code')
  @HttpCode(HttpStatus.OK)
  async registerSendOTP(
    @Body() register_info: any,
    // @Res({ passthrough: true }) response: FastifyReply,
  ): Promise<any> {
    try {
    } catch (error) {
      throw new ErrorException(error.message);
    }
  }
}
