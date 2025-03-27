import { Role } from 'src/modules/privileges/entities/role.entity';

import {
    createParamDecorator,
    ExecutionContext,
} from '@nestjs/common';

export interface ITokenPayload {
    scope: {
        sub: number;
        email: string;
        name: string;
        roles: Role[];
        permissions: string[];
    }
}

export const $TokenPayload = createParamDecorator<string|undefined>(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();

        const payload = request.headers['$tokenPayload'];
        
        return payload as ITokenPayload | null;
    },
);