import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class CommonUtilityService {
  /**
   * @RandomNumber This function generates random numbers only.
   *  you need to pass as a parameter the range of numbers
   * @range The range type is number. example: 9000. generate 1-9000 range number only
   */
  public randomNumber(range: number) {
    return Math.floor(1000 + Math.random() * range).toString();
  }

  /**
   * Hashes a string using bcrypt with a specified cost factor.
   * @param str - The string to be hashed.
   * @returns A Promise that resolves to the hashed representation of the input string.
   * @throws ErrorException - Throws an error exception if the hashing process encounters an error.
   */
  async hashPassword(password: string) {
    try {
      const saltRounds = 10;
      const passwordString = String(password);
      return await bcrypt.hash(passwordString, saltRounds);
    } catch (error) {
      throw new Error('Error hashing password: ' + error.message);
    }
  }
  /**
   * Compares a token with a hashed value to check for a match.
   * @param hash - The hashed value against which the token will be compared.
   * @param str - The str to compare with the hashed value.
   * @returns A Promise that resolves to a boolean indicating whether the token matches the hash.
   * @throws ErrorException - Throws an error exception if the comparison process encounters an error.
   */
  public async compare(hash: string, str: string) {
    try {
      if (typeof hash !== 'string' || typeof str !== 'string') {
        throw new Error('Inputs must be strings');
      }
      const result = await bcrypt.compare(str, hash);
      return result;
    } catch (error) {
      throw new Error('Comparison error: ' + error.message);
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
  public async generateToken({
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
      throw new Error('Token generation encountered an error!' + error.message);
    }
  }

  /**
   * Decodes a JSON Web Token (JWT) using the provided token and secret key.
   * @param token - The JWT token to be decoded.
   * @param secret_key - The secret key used to verify and decode the JWT.
   * @returns A Promise that resolves to the decoded content of the token.
   * @throws UnauthorizedException - Throws an unauthorized exception if the token is invalid.
   */
  public async decodeToken(token: string, secret_key: string): Promise<any> {
    try {
      return jwt.verify(token, secret_key);
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
