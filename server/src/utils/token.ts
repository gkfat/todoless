import { ExecutionContext } from '@nestjs/common';

function extractTokenFromHeader(context: ExecutionContext): string | undefined {
    const request = context.switchToHttp().getRequest();

    const [type, token] = request.headers.authorization?.split(' ') ?? [];

    return type === 'Bearer' ? token : undefined;
}

export { extractTokenFromHeader };