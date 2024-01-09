import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetCookies = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.cookies; // Assuming you're using a library like 'cookie-parser' to parse cookies
  },
);
