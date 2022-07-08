import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(user: User, token: string) {
    const url = `http://localhost:5000/auth/confirm?token=${token}`;

    await this.mailerService.sendMail({
      to: user.email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: "Welcome to O'Paradis App! Confirm your Email",
      context: {
        name: `${user.firstname} ${user.lastname}`,
        url,
      },
      html: `<h1>Welcome to O'Paradis App!</h1>
        <p>Hi ${user.firstname} ${user.lastname},</p>
        <p>Please confirm your email by clicking the link below:</p>
        <a href="${url}">${url}</a>
      `,
    });
  }
}
