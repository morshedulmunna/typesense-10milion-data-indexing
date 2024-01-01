import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RollBaseGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true; // No roles defined, allow access by default
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user; // Assuming user information is available in the request

    // Check if the user's roles match any of the allowed roles
    const hasPermission = () => roles.some((role) => user.roles.includes(role));

    return user && user.roles && hasPermission();
  }
}
