import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { MailService } from './mail.service';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: process.env.MAILER_FROM,
          // pass: process.env.MAILER_PASSWORD,
          clientId: process.env.MAILER_CLIENT_ID,
          clientSecret: process.env.MAILER_CLIENT_SECRET,
          refreshToken: process.env.MAILER_REFRESH_TOKEN,
          accessToken: process.env.MAILER_ACCESS_TOKEN,
        },
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
