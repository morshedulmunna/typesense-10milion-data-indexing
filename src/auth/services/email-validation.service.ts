import { Injectable } from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { AuthJwtService } from 'src/libs/auth-jwt.service';
import { ErrorException } from 'src/libs/errors.exception';
import { PrismaService } from 'src/libs/prisma.service';

@Injectable()
export class EmailVerifyService {
  constructor(
    private jwt: AuthJwtService,
    private readonly prisma: PrismaService,
  ) {}

  async verifyEmail(
    OTP: string,
    verification_token: string,
    response: FastifyReply,
  ) {
    try {
      const decodedData = await this.jwt.decodeToken(
        verification_token,
        process.env.EMAIL_VALIDATION_JWT_SECRET,
      );

      if (decodedData.activationCode !== OTP.toString()) {
        throw new Error('Invalid OTP!');
      }

      response.clearCookie('verification_token');

      console.log(decodedData);

      const {} = decodedData;

      // TODO:-> Now register user store data in DB
    } catch (error) {
      throw new ErrorException(error);
    }
  }
}
