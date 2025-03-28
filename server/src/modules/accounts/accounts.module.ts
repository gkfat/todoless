import { MiddlewaresModule } from 'src/middlewares/middlewares.module';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthService } from '../auth/auth.service';
import { OAuthService } from '../auth/oauth.service';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';
import { AccountAuth } from './entities/account-auth.entity';
import { Account } from './entities/account.entity';

@Module({
    imports: [MiddlewaresModule, TypeOrmModule.forFeature([Account, AccountAuth])],
    controllers: [AccountsController],
    providers: [
        AccountsService,
        AuthService,
        OAuthService,
    ],
    exports: [AccountsService],
})
export class AccountsModule {}
