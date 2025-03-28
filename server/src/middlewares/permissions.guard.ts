import { PERMISSIONS_KEY } from 'src/decorators/require-permissions.decorators';
import { ITokenPayload } from 'src/decorators/token-payload.decorators';
import { RbacService } from 'src/infra/rbac/rbac';

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
        private readonly rbacService: RbacService,
    ) {}

    async canActivate(context: ExecutionContext) {
        const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
            PERMISSIONS_KEY,
            [context.getHandler(), context.getClass()],
        );

        if (!requiredPermissions) {
            return true;
        }

        const tokenPayload: ITokenPayload = context.switchToHttp().getRequest().headers['$tokenPayload'];

        if (!tokenPayload || !tokenPayload.scope.roles) {
            return false;
        }

        for (const p of requiredPermissions) {
            const [
                ,
                resource,
                action,
            ] = p.split('.');
            const hasPermission = await this.rbacService.hasPermission(
                tokenPayload.scope.roles.map((r) => r.role),
                resource,
                action,
            );

            if (!hasPermission) {
                return false;
            }
        }

        return true;
    } 
}

