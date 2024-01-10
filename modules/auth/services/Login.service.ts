import { Injectable } from '@nestjs/common';
import { loginDto } from '../dto/index.dto';
import { CommonUtilityService } from '../utility-service/common-utility.service';
import { AuthRepository } from '../repository/auth.repository';

@Injectable()
export class LoginService {
  constructor(
    private readonly commonUtilityService: CommonUtilityService,
    private readonly authRepository: AuthRepository,
  ) {}
  async login(userLoginInfo: loginDto) {
    const { email, password } = userLoginInfo;

    const userData = await this.authRepository.getSingleUserInfo(email);

    const { id, email: user_email, name, isVerified, role } = userData;

    if (!userData) {
      throw new Error(` User ${email} not found! please register.`);
    }

    if (userData.isVerified === false) {
      throw new Error(`User ${email} is not verified!`);
    }

    const res = await this.commonUtilityService.compare(
      userData.password,
      password,
    );

    if (!res) {
      throw new Error('Invalid password');
    }

    // Generate Email validation token for sending
    const access_token = await this.commonUtilityService.generateToken({
      payload: {
        id,
        name,
        role,
        email: user_email,
        isVerified,
      },
      secret: process.env.JWT_SECRET,
      expiresIn: parseInt(process.env.JWT_SECRET_EXPIRE) * 60 * 1000,
    });
    // Generate Email validation token for sending
    const refresh_token = await this.commonUtilityService.generateToken({
      payload: {
        id,
        name,
        role,
        email: user_email,
        isVerified,
      },
      secret: process.env.JWT_SECRET,
      expiresIn: parseInt(process.env.REFRESH_JWT_SECRET_EXPIRE) * 60 * 1000,
    });

    return {
      message: `Login successful!`,
      access_token,
      refresh_token,
    };
  }
}
