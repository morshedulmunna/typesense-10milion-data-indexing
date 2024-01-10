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

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const isPublic = this.reflector.get<boolean>(
      IS_PUBLIC_KEY,
      context.getHandler(),
    );
    if (isPublic) {
      return true;
    }

    const token =
      request.headers.authorization?.replace('Bearer ', '') ||
      request.cookies.authToken ||
      (request.session && request.session.token); // Check for session existence

    if (!token) return false;

    const tokenVerified: any = await this.isTokenVerify(
      token,
      process.env.JWT_SECRET,
    );

    const requiredRole = this.reflector.get<string>(
      ROLES_KEY,
      context.getHandler(),
    );

    if (!requiredRole) {
      return true; // No specific role required, allow access
    }
    // Your authentication logic here to validate user role
    const { role } = tokenVerified;
    if (!tokenVerified || role !== requiredRole) {
      throw new UnauthorizedException(
        'You do not have the necessary role to access this resource',
      );
    }

    return true;
  }
  // TODO: Authentication Logic not working properly
  private async isTokenVerify(token: string, secret: string) {
    const decoded = await this.commonService.decodeToken(token, secret);

    if (!decoded) return true;

    return decoded;
  }
}

//    // Check for Bearer token in headers or auth token in cookies
//    const token =
//    request.headers.authorization ||
//    request.cookies.authToken ||
//    (request.session && request.session.token); // Check for session existence

//  // if (!token) {
//  //   throw new UnauthorizedException('Token not provided');
//  // }

//  const tokenVerified = await this.isTokenVerify(
//    token,
//    process.env.JWT_SECRET,
//  );
//  console.log(tokenVerified);

//  if (!tokenVerified) {
//    throw new UnauthorizedException('Invalid token');
//  }
