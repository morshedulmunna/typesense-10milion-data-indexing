import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthRepository } from '../repository/auth.repository';
import { CommonUtilityService } from '../utility-service/common-utility.service';

@Injectable()
export class RefreshTokenService {
  constructor(private readonly commonUtility: CommonUtilityService) {}
  async refreshToken(token: string) {
    const decodedData: any = await this.commonUtility.decodeToken(
      token,
      process.env.JWT_SECRET,
    );

    if (!decodedData)
      throw new BadRequestException('Invalid Validation Token!');

    const { id, name, role, email, isVerified } = decodedData;

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
      message: `success!`,
      data: decodedData,
      access_token,
      refresh_token,
    };
  }
}
