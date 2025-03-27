import { ITokenPayload } from 'src/decorators/token-payload.decorators';
import { CacheService } from 'src/middlewares/cache.service';
import { extractTokenFromHeader } from 'src/utils/token';

import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(
        private readonly configService: ConfigService,
        private readonly cacheService: CacheService,
        private readonly jwtService: JwtService,
    ) {
    }

    async canActivate(context: ExecutionContext) {
        const token = extractTokenFromHeader(context);

        if (!token) {
            throw new ForbiddenException('token expired, please re-login');
        }

        try {
            const secret = this.configService.get('JWT_SECRET');
            const payload: ITokenPayload = await this.jwtService.verifyAsync(
                token,
                { secret },
            );

            const redisToken = await this.cacheService.getValue(`token:${payload.scope.sub}`);

            if (!redisToken) {
                throw new ForbiddenException('token expired, please re-login');
            }

            // set payload to headers
            context.switchToHttp().getRequest().headers['$tokenPayload'] = payload;
        } catch {
            throw new ForbiddenException('token expired, please re-login');
        }

        return true;
    } 
}

