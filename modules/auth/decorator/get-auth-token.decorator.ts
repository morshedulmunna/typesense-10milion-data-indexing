import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetToken = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    let token: string | null = null;

    // Check headers for token
    const authorizationHeader = request.headers['authorization'];
    if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
      token = authorizationHeader.slice(7); // Remove 'Bearer ' prefix
    }

    // Check cookies for token
    if (!token && request.cookies && request.cookies['token']) {
      token = request.cookies['token'];
    }

    // Check session for token (if using session)
    if (!token && request.session && request.session.token) {
      token = request.session.token;
    }

    console.log('Auth Token: ........', token);

    return token;
  },
);
