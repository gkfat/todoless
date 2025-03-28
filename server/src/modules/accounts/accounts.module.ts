import { MiddlewaresModule } from 'src/middlewares/middlewares.module';

import { Module } from '@nestjs/common';

import { AuthService } from '../auth/auth.service';
import { OAuthService } from '../auth/oauth.service';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';

@Module({
    imports: [MiddlewaresModule],
    controllers: [AccountsController],
    providers: [
        AccountsService,
        AuthService,
        OAuthService,
    ],
    exports: [AccountsService],
})
export class AccountsModule {}
