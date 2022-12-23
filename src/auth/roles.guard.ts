import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(ctx: ExecutionContext) {
    const roles = this.reflector.getAllAndMerge<string[]>('roles', [
      ctx.getClass(),
      ctx.getHandler(),
    ]);

    const req = ctx.switchToHttp().getRequest();

    if (!roles.includes(req.user.role)) return false;

    return true;
  }
}
