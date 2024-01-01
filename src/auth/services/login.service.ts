import { Injectable } from '@nestjs/common';
import { LoginDTO } from '../dto/auth.dto';
import { AuthEntity } from '../entity/authentity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthJwtService } from 'src/libs/auth-jwt.service';
import { FastifyReply } from 'fastify';

@Injectable()
export class LoginService {
  constructor(
    private jwt: AuthJwtService,
    @InjectRepository(AuthEntity)
    private readonly authRepository: Repository<AuthEntity>,
  ) {}

  async login({ email, password }: LoginDTO, response: FastifyReply) {
    //Check if user with the provided email or phone already exists if not return user not register
    const user = await this.authRepository.findOne({ where: { email } });
    console.log(user);
    if (!user) {
      throw new Error(`User not found. Please register!`);
    }

    // Verify Password is Correct or Not
    const isPasswordCorrect = await this.jwt.compare(
      user.password,
      password.toString(),
    );

    if (!isPasswordCorrect) {
      throw new Error(`password is incorrect`);
    }

    // Generate access token && refresh token

    // AccessToken Generate
    const accessToken = await this.jwt.generateToken({
      payload: {
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
        role: user.role,
      },
      secret: process.env.ACCESS_TOKEN_SECRET,
      expiresIn: 5 * 60 * 1000,
    });

    // refresh token Generate
    const refreshToken = await this.jwt.generateToken({
      payload: {
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
        role: user.role,
      },
      secret: process.env.REFRESH_TOKEN_SECRET,
      expiresIn: 24 * 60 * 60 * 1000,
    });
    // sent token and success result

    response.setCookie('access_token', accessToken);
    response.setCookie('refresh_token', refreshToken);

    return {
      message: 'login successful!',
      token: {
        access_token: accessToken,
        refresh_token: refreshToken,
      },
    };
  }
}
