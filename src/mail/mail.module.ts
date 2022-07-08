import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { MailService } from './mail.service';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.mailtrap.io',
        port: 2525,
        auth: {
          user: process.env.MAILER_FROM,
          pass: process.env.MAILER_PASSWORD,
        },
      },
      defaults: {
        from: '"No Reply" <noreply@oparadis.com>',
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
