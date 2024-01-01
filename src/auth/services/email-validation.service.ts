import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FastifyReply } from 'fastify';
import { AuthJwtService } from 'src/libs/auth-jwt.service';
import { ErrorException } from 'src/libs/errors.exception';
import { ulid } from 'ulid';
import { AuthEntity } from '../entity/authentity';
import { Repository } from 'typeorm';

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
      const decodedData = await this.jwt.decodeToken(
        verification_token,
        process.env.EMAIL_VALIDATION_JWT_SECRET,
      );

      if (decodedData.activationCode !== OTP.toString()) {
        throw new Error('Invalid OTP!');
      }

      response.clearCookie('verification_token');

      const { name, email, password } = decodedData;

      // Store data in DB with password hash
      const hash_password = await this.jwt.hashPassword(password);

      // AccessToken Generate
      const accessToken = await this.jwt.generateToken({
        payload: {
          name,
          email,
        },
        secret: process.env.ACCESS_TOKEN_SECRET,
        expiresIn: 5 * 60 * 1000,
      });

      // refresh token Generate
      const refreshToken = await this.jwt.generateToken({
        payload: {
          name,
          email,
        },
        secret: process.env.REFRESH_TOKEN_SECRET,
        expiresIn: 24 * 60 * 60 * 1000,
      });

      // Special Token
      const special_token = ulid();

      // -> Store data in DB
      this.authRepository.save({
        name,
        email,
        password: hash_password,
        special_token,
        isVerified: true,
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
