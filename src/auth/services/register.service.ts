import { FastifyReply } from 'fastify';
import { Injectable } from '@nestjs/common';
import { AuthJwtService } from 'src/libs/auth-jwt.service';
import { CommonService } from 'src/libs/common.service';
import { SendMailService } from 'src/libs/send-email.service';
import { ErrorException } from 'src/libs/errors.exception';
import { AuthEntity } from '../entity/auth.entity';
@Injectable()
export class RegisterService {
  constructor(private readonly authService: AuthJwtService) {}
  private common = new CommonService();
  private emailService = new SendMailService();

  async sendEmailValidationCode(
    register_info: AuthEntity,
    response: FastifyReply,
  ) {
    try {
      const { email, name, password } = register_info;

      // Checking user already exist or not

      // Hash Password
      // Random Number generate
      const activationCode = this.common.randomNumber(9000);

      console.log(process.env.EMAIL_VALIDATION_JWT_SECRET);

      // Generate Email validation token for sending
      const email_validation_token = await this.authService.generateToken({
        payload: {
          email,
          name,
          activationCode,
          password,
        },
        secret: process.env.EMAIL_VALIDATION_JWT_SECRET,
        expiresIn:
          parseInt(process.env.EMAIL_VALIDATION_JET_SECRET_EXPIRE) * 60 * 1000,
      });

      // Email send for validation code
      await this.emailService.sendEmail({
        email,
        subject: 'Activation Your Account',
        template: 'activation-mail.ejs',
        data: { name, activationCode },
      });

      response.setCookie('verification_token', email_validation_token);

      return {
        message: `Please Check OTP send to ${email} for email verification`,
      };
    } catch (error) {
      throw new ErrorException(error);
    }
  }
}
