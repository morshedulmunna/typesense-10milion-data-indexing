import { FastifyReply } from 'fastify';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LogoutService {
  async logout(response: FastifyReply) {
    response.clearCookie('access_token');
    response.clearCookie('refresh_token');

    return {
      message: 'Logged out successfully!',
    };
  }
}
