import { AppModule } from 'src/app.module';
import { traceLog } from 'src/plugins/trace';

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

const initNest = async () => {
    const app = await NestFactory.create(AppModule);

    app.use(traceLog);

    app.enableCors();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(new ValidationPipe());

    // graceful shutdown
    app.enableShutdownHooks();
    
    return app;
};

export default initNest;