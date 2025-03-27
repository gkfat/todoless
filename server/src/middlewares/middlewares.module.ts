import { CacheService } from 'src/middlewares/cache.service';

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthGuard } from './auth.guard';
import { PermissionsGuard } from './permissions.guard';

@Module({
    imports: [JwtModule],
    providers: [
        AuthGuard,
        PermissionsGuard,
        CacheService,
    ],
})
export class MiddlewaresModule {}
