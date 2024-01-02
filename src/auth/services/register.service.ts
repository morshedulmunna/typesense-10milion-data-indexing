import { FastifyReply } from 'fastify';
import { Injectable } from '@nestjs/common';
import { AuthJwtService } from 'src/libs/auth-jwt.service';
import { CommonService } from 'src/libs/common.service';
import { SendMailService } from 'src/libs/send-email.service';
import { ErrorException } from 'src/libs/errors.exception';
import { AuthEntity } from '../entity/auth.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
@Injectable()
export class RegisterService {
  constructor(
    private jwt: AuthJwtService,
    private readonly authService: AuthJwtService,
    @InjectRepository(AuthEntity)
    private readonly authRepository: Repository<AuthEntity>,
  ) {}
  private common = new CommonService();
  private emailService = new SendMailService();

  async sendEmailValidationCode(
    register_info: AuthEntity,
    response: FastifyReply,
  ) {
    try {
      const { email, name, password } = register_info;

      // Check if user with the provided email or phone already exists if not return user not register
      const user = await this.authRepository.findOne({ where: { email } });
      if (user?.isVerified === false) {
        throw new Error(
          `User ${name} already registered but not verified. please check your ${email} to getting OTP`,
        );
      }

      // Random Number generate
      const activationCode = this.common.randomNumber(9000);

      // Generate Email validation token for sending
      const email_validation_token = await this.authService.generateToken({
        payload: {
          email,
          name,
          activationCode,
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

      const hash_password = await this.jwt.hashPassword(password);
      // -> Store data in DB
      const registerUser = await this.authRepository.save({
        name,
        email,
        password: hash_password,
      });

      return {
        message: `Please Check OTP send to ${email} for email verification.`,
        token: email_validation_token,
        user: registerUser,
      };
    } catch (error) {
      throw new ErrorException(error);
    }
  }
}
