import { Module } from '@nestjs/common';
import { ErrorExceptionService } from './error-exception.service';

@Module({
  providers: [ErrorExceptionService],
  exports: [ErrorExceptionService],
})
export class ErrorExceptionModule {}
