/**
 * Custom exception class to handle and format errors uniformly.
 */
import { HttpException, HttpStatus } from '@nestjs/common';

export class ErrorException extends HttpException {
  constructor(error: any) {
    console.log(error);
    super(
      {
        status: 'Something Wrong!',
        message: error.message,
        error: error,
        statusCode: HttpStatus.BAD_REQUEST,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
