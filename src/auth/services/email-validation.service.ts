import { Injectable } from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { AuthJwtService } from 'src/libs/auth-jwt.service';
import { ErrorException } from 'src/libs/errors.exception';
import { PrismaService } from 'src/libs/prisma.service';
import { ulid } from 'ulid';

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

      const existUser = await this.prisma.auth.findUnique({
        where: {
          email: email,
        },
      });
      console.log(existUser);

      //TODO-> work here

      // if (existUser.isVerified) {
      //   throw new Error('email is already Verified');
      // }
      // if (!existUser) {
      //   throw new Error('User not Register. please signup first!');
      // }

      // -> Store data in DB
      const registerInfo = await this.prisma.auth.create({
        data: {
          name,
          email,
          password: hash_password,
          isVerified: true,
          special_key: ulid(),
        },
      });
      delete registerInfo.password;
      delete registerInfo.special_key;

      response.setCookie('access_token', accessToken);
      response.setCookie('refresh_token', refreshToken);

      return {
        message: 'Email Verified!',
        data: registerInfo,
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
