import { Injectable } from '@nestjs/common';
import { AuthJwtService } from 'src/libs/auth-jwt.service';

@Injectable()
export class EmailVerifyService {
  constructor(private jwt: AuthJwtService) {}

  async verifyEmail(OTP: string, verification_token: string) {
    try {
      const isVerified = await this.jwt.decodeToken(
        verification_token,
        process.env.EMAIL_VALIDATION_JWT_SECRET,
      );
      // TODO: Solve the Error
      console.log(isVerified);
    } catch (error) {
      console.log(error);
    }

    // console.log(isVerified);
  }
}
