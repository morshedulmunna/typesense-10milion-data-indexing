import { Injectable } from '@nestjs/common';
import { LoginDTO } from '../dto/auth.dto';

@Injectable()
export class LoginService {
  async login(loginData: LoginDTO) {
    //Check if user with the provided email or phone already exists if not return user not register
    // Verify Password is Correct or Not
    // Generate access token && refresh token
    // sent token and success result
  }
}
