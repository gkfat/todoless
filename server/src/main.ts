import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import bootApp from './boot';

async function startServer() {
    const logger = new Logger('App');
    logger.log(`start app in ${process.env.NODE_ENV} mode`);
    const app = await bootApp();

    const configService = app.get(ConfigService);
    const port = configService.get('APP_PORT');

    await app.listen(+port);
    logger.log(`server running on http://localhost:${port}`);
    logger.log(`api documentation on http://localhost:${port}/documentation`);
}

startServer();
