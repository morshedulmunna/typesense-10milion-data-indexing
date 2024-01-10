import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../auth-decorator/public.decorator';
import { ROLES_KEY } from '../auth-decorator/role.decorator';
import { CommonUtilityService } from '../utility-service/common-utility.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly commonService: CommonUtilityService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const isPublic = this.reflector.get<boolean>(
      IS_PUBLIC_KEY,
      context.getHandler(),
    );
    if (isPublic) {
      return true;
    }

    // Check for Bearer token in headers or auth token in cookies
    // const token =
    //   request.headers.authorization ||
    //   request.cookies.authToken ||
    //   request.session.token;

    //  if(request.headers.authorization){
    //   if (!this.isTokenVerify(token, 'sds')) {
    //     return false;
    //   }
    //  }

    // console.log(token);

    // if (!token) {
    //   return false;
    // }

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

  private async isTokenVerify(token: string, secret: string) {
    const decoded = await this.commonService.decodeToken(token, secret);
    if (!decoded) return false;
  }
}
