import { Injectable } from '@nestjs/common';
import { AuthRepository } from '../repository/auth.repository';
import { FastifyReply } from 'fastify';
import { registerDto } from '../dto/index.dto';

@Injectable()
export class EmailVerifyService {
  constructor(private readonly authRepository: AuthRepository) {}

  async emailVerify(register_info: registerDto, response: FastifyReply) {
    return;
  }
}
