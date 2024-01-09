import { Injectable } from '@nestjs/common';
import { AuthRepository } from '../repository/auth.repository';
import { FastifyReply } from 'fastify';
import { registerDto, verifyEmailDTO } from '../dto/index.dto';
import * as jwt from 'jsonwebtoken';
import { CommonUtilityService } from '../utility-service/common-utility.service';

interface DecoderUserInfo {
  email: string;
  name: string;
  activationCode: string;
  password: string;
  iat: number;
  exp: number;
}

@Injectable()
export class EmailVerifyService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly commonUtility: CommonUtilityService,
  ) {}

  async emailVerify({ otp }: verifyEmailDTO, token: string) {
    const decodedData: any = await this.commonUtility.decodeToken(
      token,
      process.env.JWT_SECRET,
    );

    console.log(decodedData);

    const { activationCode, password, iat, exp, ...cleanedData } = decodedData;

    // Direct comparison between activationCode and OTP
    if (activationCode !== otp.toString()) {
      throw new Error('Invalid OTP!');
    }

    // Update user information; set isVerified to true
    const res = await this.authRepository.updateUserByEmail({
      ...cleanedData,
      isVerified: true,
    });

    if (res.affected > 0) {
      return {
        message: `your email ${decodedData.email}  is Verified`,
      };
    }
  }
}
