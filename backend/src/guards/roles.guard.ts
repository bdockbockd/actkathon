import { CanActivate, ExecutionContext, ForbiddenException, Injectable, RequestMethod } from '@nestjs/common';
import { METHOD_METADATA, PATH_METADATA } from '@nestjs/common/constants';
import { Reflector } from '@nestjs/core';
import { UserRole } from 'aws-sdk/clients/workmail';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublicAPI = this.reflector.getAllAndOverride<boolean>('isPublicAPI', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublicAPI) {
      return true;
    }
    const roles = this.reflector.getAllAndMerge<string[]>('roles', [context.getHandler(), context.getClass()]);
    if (roles.length > 0) {
      const request = context.switchToHttp().getRequest();
      const role: UserRole = request.user.role;
      // const user = await this.userService.findByPhone(request.role);
      if (!roles.includes(role)) {
        const path = this.reflector.get<string>(PATH_METADATA, context.getHandler());
        const cPath = this.reflector.get<string>(PATH_METADATA, context.getClass());
        const methodNum = this.reflector.get<number>(METHOD_METADATA, context.getHandler());
        const method = Object.keys(RequestMethod).find((key) => RequestMethod[key] === methodNum);
        throw new ForbiddenException(`${role} role is not allowed on ${method} ${cPath}/${path}`);
      }
    }
    return true;
  }
}
