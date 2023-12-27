import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { RegisterService } from './services/register.service';
import { AuthJwtService } from 'src/libs/auth-jwt.service';

@Module({
  controllers: [AuthController],
  providers: [RegisterService, AuthJwtService],
})
export class AuthModule {}
