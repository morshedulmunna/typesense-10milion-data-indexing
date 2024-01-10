import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
} from '@nestjs/common';
import { registerDto } from '../dto/index.dto';
import { EmailOptionTypes, SendMailService } from '@app/send-mailer';
import { AuthRepository } from '../repository/auth.repository';
import { CommonUtilityService } from '../utility-service/common-utility.service';
import { FastifyReply } from 'fastify';

@Injectable()
export class RegistrationService {
  constructor(
    private readonly commonUtility: CommonUtilityService,
    private readonly SendMailService: SendMailService,
    private readonly AuthRepository: AuthRepository,
  ) {}

  async registration(register_info: registerDto, response: FastifyReply) {
    const { email, name, password } = register_info;

    // Hashed Password
    const hashPassword = await this.commonUtility.hashPassword(password);

    // Random Number generate
    const activationCode = this.commonUtility.randomNumber(9000);

    // Generate Email validation token for sending
    const email_validation_token = await this.commonUtility.generateToken({
      payload: {
        email,
        name,
        activationCode,
        password: hashPassword,
      },
      secret: process.env.JWT_SECRET,
      expiresIn: parseInt(process.env.JWT_SECRET_EXPIRE) * 60 * 1000,
    });

    const emailOptions: EmailOptionTypes = {
      email: email,
      subject: 'Verification Code for Registration!',
      template: '/modules/auth/templates/activation-mail.ejs',
      data: { name, activationCode },
    };

    const result = await this.AuthRepository.getSingleUserInfo(email);

    if (!result) {
      await this.AuthRepository.registerUser({
        email,
        name,
        password: hashPassword,
      });
    } else if (result.isVerified === false) {
      //BUG: How can i pass Error in frontend
      throw new BadRequestException(
        `User ${email} already registered! Not Verified. Please verify your email using OTP`,
      );
    } else if (result.isVerified === true) {
      throw new BadRequestException(
        `User ${email} already registered! & verified`,
      );
    }

    await this.SendMailService.sendEmail(emailOptions);

    // response.setCookie('verification_token', email_validation_token);

    return {
      message: 'Verification Code Sent!',
      token: email_validation_token,
    };
  }
}
