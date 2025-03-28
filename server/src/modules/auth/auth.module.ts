import { Module } from '@nestjs/common';

import { MiddlewaresModule } from '../../middlewares/middlewares.module';
import { AccountsService } from '../accounts/accounts.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { EmailService } from './email.service';
import { OAuthService } from './oauth.service';

@Module({
    imports: [MiddlewaresModule],
    controllers: [AuthController],
    providers: [
        AuthService,
        OAuthService,
        AccountsService,
        EmailService,
    ],
})
export class AuthModule {}
