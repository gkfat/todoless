import { MailtrapClient } from 'mailtrap';

import {
    Injectable,
    Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
    private readonly logger = new Logger('EmailService');
    private readonly sender = this.configService.get('MAIL_SENDER') ?? 'service@hahaglassesking.com';
    private readonly client = new MailtrapClient({ token: this.configService.getOrThrow('MAIL_API_TOKEN') });

    constructor(
        private readonly configService: ConfigService,
    ) {}

    async sendVerificationCode(email: string, code: string) {
        const res = await this.client.send({
            from: {
                name: 'Service',
                email: this.sender,
            },
            to: [{ email }],
            template_uuid: '35def078-ffbf-4be4-8e75-5f1e8a5a0e62',
            template_variables: { verification_code: code },
        });

        this.logger.log(`send email response: ${JSON.stringify(res)}`);
    }

}

