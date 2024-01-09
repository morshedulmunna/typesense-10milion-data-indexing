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

    const { email, name, activationCode, password, iat, exp } = decodedData;

    if (decodedData.activationCode !== otp.toString()) {
      throw new Error('Invalid OTP!');
    }

    // TODO: needs to Update user information it's isVerified:true

    // return await this.authRepository.updateUserByEmail();
  }
}
