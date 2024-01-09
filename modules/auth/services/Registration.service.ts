import { Injectable } from '@nestjs/common';
import { registerDto } from '../dto/index.dto';
import { FastifyReply } from 'fastify';
import { EmailOptionTypes, SendMailService } from '@app/send-mailer';
import { AuthRepository } from '../repository/auth.repository';
import { CommonUtilityService } from '../utility-service/common-utility.service';

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

    // Email send for validation code
    try {
      // If User Already Registered and Verified

      const result = await this.AuthRepository.getSingleUserInfo(email);

      if (!result) {
        await this.AuthRepository.registerUser({
          email,
          name,
          password: hashPassword,
        });
      } else if (result.isVerified === false) {
        //BUG: How can i pass Error in frontend
        throw new Error(
          `User ${email} already registered! Not Verified. Please verify your email using OTP`,
        );
      }

      await this.SendMailService.sendEmail(emailOptions);
    } catch (error) {
      throw new Error(error.message);
    }

    // response.setCookie('verification_token', email_validation_token);

    return {
      message: 'Verification Code Sent!',
      token: email_validation_token,
    };
  }
}
