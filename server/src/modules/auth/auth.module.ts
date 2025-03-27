import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CacheService } from '../../middlewares/cache.service';
import { MiddlewaresModule } from '../../middlewares/middlewares.module';
import { AccountsService } from '../accounts/accounts.service';
import { AccountAuth } from '../accounts/entities/account-auth.entity';
import { Account } from '../accounts/entities/account.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { EmailService } from './email.service';
import { OAuthService } from './oauth.service';

@Module({
    imports: [
        JwtModule,
        MiddlewaresModule,
        TypeOrmModule.forFeature([Account, AccountAuth]),
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        OAuthService,
        AccountsService,
        CacheService,
        EmailService,
    ],
})
export class AuthModule {}
