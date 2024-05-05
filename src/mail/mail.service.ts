import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport, SendMailOptions } from 'nodemailer';

@Injectable()
export class MailService {
    constructor(private readonly configService: ConfigService) {}

    private get transport() {
        const isSecure = this.configService.get('MAIL_SECURE') === 'true';
        return createTransport({
            host: this.configService.get('MAIL_HOST'),
            port: this.configService.get('MAIL_PORT'),
            secure: isSecure,
            auth: {
                user: this.configService.get('MAIL_AUTH_USER'),
                pass: this.configService.get('MAIL_AUTH_PASS'),
            },
        });
    }

    async send(mailOptions: Omit<SendMailOptions, 'from'>) {
        try {
            const from = this.configService.get('MAIL_FROM');
            return await this.transport.sendMail({
                ...mailOptions,
                from,
            });
        } catch (err) {
            // TODO: logger
            throw err;
        }
    }
}
