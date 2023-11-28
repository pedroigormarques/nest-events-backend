import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from './../user/entities/user.entity';

export const CurrentUser = createParamDecorator(
  (data: any, ctx: ExecutionContext): User | null => {
    const request = ctx.switchToHttp().getRequest();
    return request.user ?? null;
  },
);
