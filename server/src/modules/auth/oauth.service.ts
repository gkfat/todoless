import { OAuth2Client } from 'google-auth-library';

import {
    Injectable,
    Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { LoginOrCreateDto } from './dto/login-or-create.dto';

@Injectable()
export class OAuthService {
    private readonly logger = new Logger('OAuthService');
    private gAuth: OAuth2Client;

    constructor(
        private readonly configService: ConfigService,
    ) {
        const CLIENT_ID = this.configService.getOrThrow('GOOGLE_CLIENT_ID');
        const CLIENT_SECRET = this.configService.getOrThrow('GOOGLE_CLIENT_SECRET');
        const REDIRECT_URI = this.configService.getOrThrow('REDIRECT_URI');

        this.gAuth = new OAuth2Client({
            clientId: CLIENT_ID,
            clientSecret: CLIENT_SECRET,
            redirectUri: REDIRECT_URI,
        });
    }

    async google(reqBody: LoginOrCreateDto): Promise<{
        email: string;
        name: string;
        identifier: string;
        avatar: string;
        credential: null,
    }> {
        const { code } = reqBody;
        
        try {
            const { tokens } = await this.gAuth.getToken(code);
            this.gAuth.setCredentials(tokens);

            const idToken = tokens.id_token;

            const ticket = await this.gAuth.verifyIdToken({
                idToken,
                audience: this.gAuth._clientId,
            });

            const userInfo = ticket.getPayload();

            if (userInfo) {
                return {
                    email: userInfo.email,
                    name: userInfo.name,
                    identifier: userInfo.sub,
                    avatar: userInfo.picture,
                    credential: null,
                };
            }

        } catch (err) {
            this.logger.error('Google login fail: ', err);
        }

        return null;
    }

}

