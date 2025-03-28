import {
    NextFunction,
    Request,
    Response,
} from 'express';

import { Logger } from '@nestjs/common';

const logger = new Logger('trace');

export const traceLog = async (req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now();
    const {
        method, originalUrl, 
    } = req;

    res.on('finish', () => {
        const duration = Date.now() - startTime;
        const statusCode = res.statusCode;

        logger.log(`[${method}] ${originalUrl} - ${statusCode} - ${duration}ms`);
    });

    next();
};

