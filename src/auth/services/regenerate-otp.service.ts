import { FastifyReply } from 'fastify';
import { Injectable } from '@nestjs/common';
import { AuthJwtService } from 'src/libs/auth-jwt.service';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthEntity } from '../entity/auth.entity';
import { Repository } from 'typeorm';
import { CommonService } from 'src/libs/common.service';
import { SendMailService } from 'src/libs/send-email.service';

@Injectable()
export class RegenerateOTP {
  constructor(
    private readonly authService: AuthJwtService,
    @InjectRepository(AuthEntity)
    private readonly authRepository: Repository<AuthEntity>,
    private readonly common: CommonService,
  ) {}

  private emailService = new SendMailService();

  async regenerateOTP(response: FastifyReply, email: string) {
    console.log(email);

    //TODO: -> Email getting null

    // Generate Email validation token for sending
    const userInfo = await this.authRepository.findOne({ where: { email } });

    const activationCode = this.common.randomNumber(9000);

    const email_validation_token = await this.authService.generateToken({
      payload: {
        email: userInfo.email,
        name: userInfo.name,
        activationCode,
      },
      secret: process.env.EMAIL_VALIDATION_JWT_SECRET,
      expiresIn:
        parseInt(process.env.EMAIL_VALIDATION_JET_SECRET_EXPIRE) * 60 * 1000,
    });

    let name = userInfo.name;

    // Email send for validation code
    await this.emailService.sendEmail({
      email: userInfo.email,
      subject: 'Activation Your Account',
      template: 'activation-mail.ejs',
      data: { name, activationCode },
    });

    response.setCookie('verification_token', email_validation_token);

    return {
      message: `Please Check OTP send to ${userInfo.email} for email verification`,
      token: email_validation_token,
      user: userInfo,
    };
  }
}
