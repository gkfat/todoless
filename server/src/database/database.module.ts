import fs from 'node:fs';

import { snakeCase } from 'lodash';
import {
    DefaultNamingStrategy,
    NamingStrategyInterface,
} from 'typeorm';

import {
    Global,
    Module,
} from '@nestjs/common';
import {
    ConfigModule,
    ConfigService,
} from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TypeOrmFeatureModule } from './typeorm-feature.module';

export class TodolessNamingStrategy extends DefaultNamingStrategy implements NamingStrategyInterface {
    tableName(className: string, customName: string): string {
        return 'todoless_' + (customName || snakeCase(className));
    }
}

@Global()
@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => {

                const isDev = process.env.NODE_ENV === 'dev';

                return {
                    type: 'mysql',
                    host: configService.getOrThrow('DB_HOST'),
                    port: +configService.get('DB_PORT'),
                    username: configService.getOrThrow('DB_USERNAME'),
                    password: configService.getOrThrow('DB_PASSWORD'),
                    database: configService.getOrThrow('DB_NAME'),
                    synchronize: true,
                    autoLoadEntities: true,
                    timezone: 'Z',
                    namingStrategy: new TodolessNamingStrategy(),
                    ssl: isDev ? false : {
                        rejectUnauthorized: true,
                        ca: fs.readFileSync('./ca.pem'),
                    },
                };
            },
        }), TypeOrmFeatureModule,
    ],
    exports: [TypeOrmModule, TypeOrmFeatureModule],
})
export class DatabaseModule {}