import { Injectable } from '@nestjs/common';
import { regenerateOtp } from '../dto/index.dto';
import { AuthRepository } from '../repository/auth.repository';

import { EmailOptionTypes, SendMailService } from '@app/send-mailer';
import { CommonUtilityService } from '../utility-service/common-utility.service';

@Injectable()
export class RegenerateOtService {
  constructor(
    private readonly AuthRepository: AuthRepository,
    private readonly commonUtility: CommonUtilityService,
    private readonly SendMailService: SendMailService,
  ) {}
  async regenerateOtp({ email }: regenerateOtp) {
    // Getting information for register User
    const result = await this.AuthRepository.getSingleUserInfo(email);

    if (!result) {
      throw new Error(`This email address is not registered!`);
    } else if (result.isVerified === false) {
      const name = result.name;

      // Random Number generate
      const activationCode = this.commonUtility.randomNumber(9000);

      try {
        // Generate activation code & Verify Token
        const email_validation_token = await this.commonUtility.generateToken({
          payload: {
            email: result.email,
            name: result.name,
            activationCode,
            password: result.password, //TODO: Passing Hashed Password
          },
          secret: process.env.JWT_SECRET,
          expiresIn:
            parseInt(process.env.JWT_SECRET_EXPIRE) *
            60 *
            1000,
        });

        // Email Sent Options Create
        const emailOptions: EmailOptionTypes = {
          email: email,
          subject: 'Verification Code for Registration!',
          template: '/modules/auth/templates/activation-mail.ejs',
          data: { name, activationCode },
        };

        await this.SendMailService.sendEmail(emailOptions);

        return {
          message: 'Verification Code Sent!',
          token: email_validation_token,
        };
      } catch (error) {
        throw new Error(error.message);
      }
    }
  }
}
