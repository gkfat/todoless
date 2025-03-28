import fs from 'node:fs';

import { AppModule } from 'src/app.module';
import { AccountAuth } from 'src/modules/accounts/entities/account-auth.entity';
import { Account } from 'src/modules/accounts/entities/account.entity';
import { Label } from 'src/modules/labels/entities/label.entity';
import { Role } from 'src/modules/privileges/entities/role.entity';
import { Todo } from 'src/modules/todos/entities/todo.entity';
import {
    DataSource,
    DataSourceOptions,
} from 'typeorm';
import {
    runSeeders,
    SeederOptions,
} from 'typeorm-extension';

import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

const logger = new Logger('seeder');

async function run() {
    try {
        const app = await NestFactory.createApplicationContext(AppModule);
        const configService = app.get(ConfigService);
        const isDev = process.env.NODE_ENV === 'dev';
    
        const options: DataSourceOptions & SeederOptions = {
            type: 'mysql',
            host: configService.getOrThrow('DB_HOST'),
            port: +configService.getOrThrow('DB_PORT'),
            username: configService.getOrThrow('DB_USERNAME'),
            password: configService.getOrThrow('DB_PASSWORD'),
            database: configService.getOrThrow('DB_NAME'),
            ssl: isDev ? false : {
                rejectUnauthorized: true,
                ca: fs.readFileSync('./ca.pem'),
            },
            entities: [
                Account,
                AccountAuth,
                Role,
                Todo,
                Label,
            ],
    
            seeds: ['src/database/seeds/**/*{.ts,.js}'],
        };
    
        const dataSource = new DataSource(options);
    
        await dataSource.initialize();
        
        await runSeeders(dataSource);

        logger.log('Seeding completed, closing app.');

        app.close();
    } catch (err) {
        logger.error('Error running seeders: ', err);
        throw err;
    }
}

run();