import { Module } from '@nestjs/common';
import { ErrorException } from './error-exception.service';

@Module({
  providers: [ErrorException],
  exports: [ErrorException],
})
export class ErrorExceptionModule {}
