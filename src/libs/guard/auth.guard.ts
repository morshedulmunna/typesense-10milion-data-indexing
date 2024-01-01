import { Cookies } from './../decorator/cookies.decorator';
// auth.guard.ts

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  //   constructor(private authService: AuthService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest();
    const cookies = request.cookies;
    // const accessToken = request.headers['authorization'];

    console.log(cookies);

    // if (!accessToken) {
    //   return false;
    // }
    return false;
    // return this.authService.validateAccessToken(accessToken);
  }
}
