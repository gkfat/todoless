import { MiddlewaresModule } from 'src/middlewares/middlewares.module';

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CacheService } from '../../middlewares/cache.service';
import { AuthService } from '../auth/auth.service';
import { OAuthService } from '../auth/oauth.service';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';
import { AccountAuth } from './entities/account-auth.entity';
import { Account } from './entities/account.entity';

@Module({
    imports: [
        JwtModule,
        MiddlewaresModule,
        TypeOrmModule.forFeature([Account, AccountAuth]),
    ],
    controllers: [AccountsController],
    providers: [
        AccountsService,
        AuthService,
        OAuthService,
        CacheService,
    ],
    exports: [AccountsService],
})
export class AccountsModule {}
