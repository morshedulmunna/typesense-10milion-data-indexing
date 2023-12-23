import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { ErrorException } from './errors.exception';

export class AuthJwtService {
  /**
   * Hashes a string using bcrypt with a specified cost factor.
   * @param str - The string to be hashed.
   * @returns A Promise that resolves to the hashed representation of the input string.
   * @throws ErrorException - Throws an error exception if the hashing process encounters an error.
   */
  async hash(str: string): Promise<string> {
    try {
      return await bcrypt.hash(str, 10);
    } catch (error) {
      throw new ErrorException(error);
    }
  }

  /**
   * Compares a token with a hashed value to check for a match.
   * @param hash - The hashed value against which the token will be compared.
   * @param token - The token to compare with the hashed value.
   * @returns A Promise that resolves to a boolean indicating whether the token matches the hash.
   * @throws ErrorException - Throws an error exception if the comparison process encounters an error.
   */
  async compare(hash: string, token: string): Promise<boolean> {
    try {
      return await bcrypt.compare(token, hash);
    } catch (error) {
      throw new ErrorException(error);
    }
  }

  /**
   * Generates a JSON Web Token (JWT) using provided payload, secret, and expiration options.
   * @param options - An object containing payload, secret, and expiration configuration for the token.
   * @param options.payload - The payload to be encoded within the token.
   * @param options.secret - The secret used to sign the token.
   * @param options.expiresIn - Expiration time for the token in seconds.
   * @returns A Promise that resolves to a string representing the generated JWT.
   * @throws ErrorException - Throws an error exception if token generation encounters an error.
   */
  async generateToken({
    payload,
    secret,
    expiresIn,
  }: {
    payload: object;
    secret: string;
    expiresIn: number;
  }): Promise<string> {
    try {
      return new JwtService().signAsync(
        { ...payload },
        {
          secret,
          expiresIn,
        },
      );
    } catch (error) {
      throw new ErrorException(error);
    }
  }

  /**
   * Decodes a JSON Web Token (JWT) using the provided token and secret key.
   * @param token - The JWT token to be decoded.
   * @param secret_key - The secret key used to verify and decode the JWT.
   * @returns A Promise that resolves to the decoded content of the token.
   * @throws UnauthorizedException - Throws an unauthorized exception if the token is invalid.
   */
  async decodeToken(token: string, secret_key: string): Promise<any> {
    try {
      const decoded = jwt.verify(token, secret_key);
      console.log(decoded);

      return decoded;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
