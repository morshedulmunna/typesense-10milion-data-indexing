import { Injectable } from '@nestjs/common';

@Injectable()
export class CommonUtilityService {
  /**
   *
   * @RandomNumber This function generates random numbers only.
   *  you need to pass as a parameter the range of numbers
   * @range The range type is number. example: 9000. generate 1-9000 range number only
   */
  public randomNumber(range: number) {
    return Math.floor(1000 + Math.random() * range).toString();
  }
}
