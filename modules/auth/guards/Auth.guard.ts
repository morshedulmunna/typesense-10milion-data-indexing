import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorator/public.decorator';
import { ROLES_KEY } from '../decorator/role.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    console.log('Request_______', request.cookies);

    const isPublic = this.reflector.get<boolean>(
      IS_PUBLIC_KEY,
      context.getHandler(),
    );
    if (isPublic) {
      return true; // Public routes can be accessed without authentication
    }

    // Check for Bearer token in headers or auth token in cookies
    const token = request.headers.authorization || request.cookies.authToken;
    if (!token) {
      return false; // If no token found, authentication fails
    }

    const requiredRole = this.reflector.get<string>(
      ROLES_KEY,
      context.getHandler(),
    );
    if (!requiredRole) {
      return true; // No specific role required, allow access
    }
    // Your authentication logic here to validate user role
    const user = context.switchToHttp().getRequest().user; // Assuming you have a user object after authentication
    if (!user || user.role !== requiredRole) {
      throw new UnauthorizedException(
        'You do not have the necessary role to access this resource',
      );
    }

    // Check token validity using your authentication service

    return false;
  }
}
