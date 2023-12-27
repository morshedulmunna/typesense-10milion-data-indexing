import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Cookies = createParamDecorator(
  (data: string | undefined, context: ExecutionContext) => {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest();
    const cookies = request.cookies;

    return cookies;
  },
);
