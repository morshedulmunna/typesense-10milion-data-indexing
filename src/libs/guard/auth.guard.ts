import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { IS_PUBLIC_KEY } from '../decorator/public.decorators';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest();
    const cookies = request.cookies;

    const isPublic = this.reflector.get<boolean>(
      IS_PUBLIC_KEY,
      context.getHandler(),
    );
    if (isPublic) {
      return true;
    }

    // Extract the token from the cookie named 'access_token'
    const accessToken = cookies['access_token'];

    if (!accessToken) {
      return false;
    }

    // Validate the token and extract user info
    // return this.authService.validateAccessToken(accessToken).then(user => {
    //   if (user) {
    //     request.user = user; // Attach user info to the request object
    //     return true;
    //   }
    //   return false;
    // }).catch(() => {
    //   return false;
    // });
  }
}
