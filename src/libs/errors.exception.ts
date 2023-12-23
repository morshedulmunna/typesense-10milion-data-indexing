import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * Custom exception class to handle and format errors uniformly.
 */
export class ErrorException extends HttpException {
  /**
   * Constructs an ErrorException instance based on the provided error.
   * @param error - The error object to be formatted.
   */
  constructor(error: any) {
    console.log(error); // Logging the error for debugging purposes (consider removing in production)

    // Creating a formatted error object with specified status code, message, and error details
    super(
      {
        status: 'Something Went Wrong',
        message: error.message, // Extracting the error message
        error: error, // Storing the full error object (consider removing in production)
        statusCode: HttpStatus.BAD_REQUEST,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
