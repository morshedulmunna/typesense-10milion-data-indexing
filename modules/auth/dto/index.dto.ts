import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { AuthEntity, UserRole } from '../repository/auth.entity';
import { Column } from 'typeorm';

export class registerDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  password: string;
}

export class regenerateOtp {
  @ApiProperty()
  @IsString()
  @IsEmail()
  email: string;
}

export class verifyEmailDTO {
  @ApiProperty()
  @IsString()
  otp: string;
}

export class UpdateUserEntity extends AuthEntity {
  @IsNumber()
  @IsOptional()
  id: number;

  @IsString()
  @IsOptional()
  name: string;

  @IsOptional()
  @Column({
    name: 'role',
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @IsString()
  @IsOptional()
  password: string;

  @IsString()
  @IsOptional()
  special_token: string;

  @IsString()
  @IsOptional()
  email: string;

  @IsBoolean()
  @IsOptional()
  isVerified: boolean;
}
