import { Injectable } from '@nestjs/common';
import { AuthJwtService } from 'src/libs/auth-jwt.service';
import { ErrorException } from 'src/libs/errors.exception';

@Injectable()
export class EmailVerifyService {
  constructor(private jwt: AuthJwtService) {}

  async verifyEmail(OTP: string, verification_token: string) {
    try {
      const decodedData = await this.jwt.decodeToken(
        verification_token,
        process.env.EMAIL_VALIDATION_JWT_SECRET,
      );

      if (decodedData.activationCode !== OTP) {
        throw new Error('Invalid OTP!');
      }

      // TODO:-> Now register user store data in DB
    } catch (error) {
      throw new ErrorException(error);
    }

    // console.log(isVerified);
  }
}
