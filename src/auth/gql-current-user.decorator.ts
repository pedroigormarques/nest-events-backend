import { GqlExecutionContext } from '@nestjs/graphql';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../user/entities/user.entity';

export const GqlCurrentUser = createParamDecorator(
  (data: any, ctx: ExecutionContext): User | null => {
    const gqlCtx = GqlExecutionContext.create(ctx);
    return gqlCtx.getContext().req.user;
  },
);
