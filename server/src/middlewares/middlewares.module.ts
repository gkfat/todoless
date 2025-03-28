import { Privileges } from 'src/enums';
import {
    initRbac,
    RbacService,
} from 'src/infra/rbac/rbac';
import { CacheService } from 'src/middlewares/cache.service';

import { Module } from '@nestjs/common';
import {
    JwtModule,
    JwtService,
} from '@nestjs/jwt';

import { AuthGuard } from './auth.guard';
import { PermissionsGuard } from './permissions.guard';

@Module({
    imports: [JwtModule],
    providers: [
        AuthGuard,
        RbacService,
        PermissionsGuard,
        {
            provide: 'RBAC_INIT',
            useFactory: async (rbacService: RbacService) => {
                await initRbac(rbacService, Privileges);
            },
            inject: [RbacService],
        },
        CacheService,
        JwtService,
    ],
    exports: [
        RbacService,
        CacheService,
        JwtService,
    ],
})
export class MiddlewaresModule {}
