import { Module } from '@nestjs/common';
import { SendMailService } from './send-mailer.service';

@Module({
  providers: [SendMailService],
  exports: [SendMailService],
})
export class SendMailerModule {}
