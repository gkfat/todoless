import { AppModule } from 'src/app.module';

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

async function initNest () {
    const app = await NestFactory.create(AppModule);

    app.enableCors();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(new ValidationPipe());

    // graceful shutdown
    app.enableShutdownHooks();
    
    return app;
}

export default initNest;