import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
} from '@nestjs/common';
import { AuthRepository } from '../repository/auth.repository';
import { FastifyReply } from 'fastify';
import { registerDto, verifyEmailDTO } from '../dto/index.dto';
import * as jwt from 'jsonwebtoken';
import { CommonUtilityService } from '../utility-service/common-utility.service';
import { ulid } from 'ulid';

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

    if (!decodedData)
      throw new BadRequestException('Invalid Validation Token!');

    const { activationCode, password, iat, exp, ...cleanedData } = decodedData;

    // Direct comparison between activationCode and OTP
    if (activationCode !== otp.toString()) {
      throw new BadRequestException('Invalid OTP!');
    }

    // Special Token
    const special_token = ulid();

    // Update user information; set isVerified to true
    await this.authRepository.updateUserByEmail({
      ...cleanedData,
      isVerified: true,
      special_token,
    });

    const result = await this.authRepository.getSingleUserInfo(
      decodedData.email,
    );

    const { id, name, role, email, isVerified } = result;
    // Generate Email validation token for sending
    const access_token = await this.commonUtility.generateToken({
      payload: {
        id,
        name,
        role,
        email,
        isVerified,
      },
      secret: process.env.JWT_SECRET,
      expiresIn: parseInt(process.env.JWT_SECRET_EXPIRE) * 60 * 1000,
    });
    // Generate Email validation token for sending
    const refresh_token = await this.commonUtility.generateToken({
      payload: {
        id,
        name,
        role,
        email,
        isVerified,
      },
      secret: process.env.JWT_SECRET,
      expiresIn: parseInt(process.env.REFRESH_JWT_SECRET_EXPIRE) * 60 * 1000,
    });

    return {
      message: `your email ${decodedData.email}  is Verified`,
      access_token,
      refresh_token,
    };
  }
}
