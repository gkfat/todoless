import { Response } from 'express';
import ms from 'ms';
import { CacheService } from 'src/middlewares/cache.service';

import {
    BadRequestException,
    Body,
    Controller,
    ForbiddenException,
    HttpStatus,
    InternalServerErrorException,
    Post,
    Res,
} from '@nestjs/common';

import { AccountsService } from '../accounts/accounts.service';
import { AuthService } from './auth.service';
import { LoginOrCreateDto } from './dto/login-or-create.dto';
import {
    SendVerificationCodeDto,
    SignUpDto,
    VerifyCodeDto,
} from './dto/sign-up.dto';
import { EmailService } from './email.service';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly accountsService: AccountsService,
        private readonly authService: AuthService,
        private readonly emailService: EmailService,
        private readonly cacheService: CacheService,
    ) {}

    private async generateVerificationCode(email: string) {
        const code = this.authService.generateVerificationCode();
        const ttl = ms('10m').toString();
        await this.cacheService.setValue(`verification_code:${email}`, code, ttl);
    
        return code;
    }

    @Post('sign-up')
    async signUp(@Body() reqBody: SignUpDto, @Res() res: Response) {
        const findAccount = await this.accountsService.findOneByEmail(reqBody.email);

        if (findAccount) {
            throw new BadRequestException('Invalid email or password');
        }

        const code = await this.generateVerificationCode(reqBody.email);

        const account = await this.accountsService.create(reqBody);

        await this.emailService.sendVerificationCode(reqBody.email, code);

        return res.json({ account });
    }

    @Post('send-verification-code')
    async sendVerificationCode(@Body() reqBody: SendVerificationCodeDto, @Res() res: Response) {
        const verifier = await this.cacheService.getValue(`verification_code:${reqBody.email}`);

        if (verifier) {
            throw new BadRequestException('Reach rate limit, please retry after 10 minutes');
        }
        
        const code = await this.generateVerificationCode(reqBody.email);

        await this.emailService.sendVerificationCode(reqBody.email, code);

        return res.json({ message: 'ok' });
    }

    @Post('verify-code')
    async verifyCode(@Body() reqBody: VerifyCodeDto, @Res() res: Response) {
        const {
            email,
            verificationCode,
        } = reqBody;

        const verifier = await this.cacheService.getValue(`verification_code:${email}`);

        if (!verifier) {
            throw new BadRequestException('Verification code expired, please get a new one');
        }

        if (verificationCode !== verifier) {
            throw new BadRequestException('Verification code incorrect');
        }

        await this.authService.verifyAccount(email);

        return res.json({ message: 'ok' });
    }

    @Post('login')
    async login(@Body() reqBody: LoginOrCreateDto, @Res() res: Response) {
        const { id } = await this.authService.loginOrCreate(reqBody);

        const account = await this.accountsService.findOne(id);

        if (account) {
            if (!account.email_verified) {
                throw new ForbiddenException('Please verified email');
            }

            if (!account.enabled) {
                throw new ForbiddenException('Account has been freezed');
            }

            const token = await this.authService.generateJwt(account);

            return res.status(HttpStatus.OK).json({
                account,
                token,
            });
        }

        throw new InternalServerErrorException('Login success but something failed');
    }
}
