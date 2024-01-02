import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FastifyReply } from 'fastify';
import { AuthJwtService } from 'src/libs/auth-jwt.service';
import { ErrorException } from 'src/libs/errors.exception';
import { ulid } from 'ulid';
import { Repository } from 'typeorm';
import { AuthEntity } from '../entity/auth.entity';

@Injectable()
export class EmailVerifyService {
  constructor(
    private jwt: AuthJwtService,
    @InjectRepository(AuthEntity)
    private readonly authRepository: Repository<AuthEntity>,
  ) {}

  async verifyEmail(
    OTP: string,
    verification_token: string,
    response: FastifyReply,
  ) {
    try {
      /**
       *
       * TODO: Checking the verification token store in cookies or headers
       *
       */

      const decodedData = await this.jwt.decodeToken(
        verification_token,
        process.env.EMAIL_VALIDATION_JWT_SECRET,
      );

      if (!decodedData)
        throw new Error(
          `Invalid Verification Token! please try again generate a new OTP!`,
        );

      if (decodedData.activationCode !== OTP.toString()) {
        throw new Error('Invalid OTP!');
      }

      const user = await this.authRepository.findOne({
        where: { email: decodedData.email },
      });
      const { email, isVerified, role, id, name } = user;

      // Special Token
      const special_token = ulid();

      // Update user information in the database
      this.authRepository.update(id, {
        isVerified: true,
        special_token: special_token,
      });

      response.clearCookie('verification_token');

      // AccessToken Generate
      const accessToken = await this.jwt.generateToken({
        payload: {
          name,
          email,
          isVerified,
          role,
          id,
        },
        secret: process.env.ACCESS_TOKEN_SECRET,
        expiresIn: 5 * 60 * 1000,
      });

      // refresh token Generate
      const refreshToken = await this.jwt.generateToken({
        payload: {
          name,
          email,
          isVerified,
          role,
          id,
        },
        secret: process.env.REFRESH_TOKEN_SECRET,
        expiresIn: 24 * 60 * 60 * 1000,
      });

      response.setCookie('access_token', accessToken);
      response.setCookie('refresh_token', refreshToken);

      return {
        message: 'Email Verified!',
        token: {
          access_token: accessToken,
          refresh_token: refreshToken,
        },
      };
    } catch (error) {
      throw new ErrorException(error);
    }
  }
}
