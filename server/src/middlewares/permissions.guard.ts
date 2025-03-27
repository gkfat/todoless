import { PERMISSIONS_KEY } from 'src/decorators/require-permissions.decorators';
import { ITokenPayload } from 'src/decorators/token-payload.decorators';

import {
    CanActivate,
    ExecutionContext,
    Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PermissionsGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
    ) {}

    async canActivate(context: ExecutionContext) {
        const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [context.getHandler(), context.getClass()]);

        if (!requiredPermissions) {
            return true;
        }

        const tokenPayload: ITokenPayload = context.switchToHttp().getRequest().headers['$tokenPayload'];

        return requiredPermissions.some((permission) => tokenPayload.scope.permissions.includes(permission));
    } 
}

