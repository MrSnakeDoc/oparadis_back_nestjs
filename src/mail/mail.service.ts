import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(user: User, token: string) {
    const url = `http://localhost:5000/api/auth/confirm?token=${token}`;

    const mailOptions = {
      to: user.email,
      from: '"O\'Paradis Team" <oparadisapi@outlook.com>',
      subject: "Welcome to O'Paradis App! Confirm your Email",
      context: {
        name: `${user.firstname} ${user.lastname}`,
        url,
      },
      html: `<html>
      <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="/style.css" />
        <title>Document</title>
      </head>
      <body>
    <img
      src="https://res.cloudinary.com/oparadis/image/upload/v1660815142/miscellaneous/uzhtk9ypy20pkilzy1q0.png"
      alt="logo"
      style="width: 100px"
    />
    <div class="desc">
      <h1 style="color: rgb(88, 130, 221)">Welcome to O'Paradis App!</h1>
      <p>Hi ${user.firstname} ${user.lastname},</p>
      <p>Nous sommes heureux de vous accueillir parmi nos membres.</p>
      <p class="desc-p">
        Vous pourrez regarder les centaines de logements disponibles pour le
        home sitting, rencontrer des millier de nouvelles personnes ou si le
        coeur vous en dit mettre votre logement en prêt.
      </p>
      <p>Please confirm your email by clicking the link below:</p>
    </div>
    <a
      class="button"
      href="${url}"
      style="
        background-image: linear-gradient(135deg, #008aff, #86d472);
        border-radius: 6px;
        box-sizing: border-box;
        color: #ffffff;
        position: relative;
        height: 50px;
        font-size: 1.4em;
        font-weight: 600;
        padding: 4px;
        position: relative;
        text-decoration: none;
        width: 7em;
        z-index: 2;
      "
      >Cliquez moi</a
    >
    <p class="desc-p">
      N'hésitez pas à revenir vers notre support si vous avez le moindre soucis
      en cliquant
      <a href="#"> ici</a>
    </p>
  </body>
    <html>
      `,
    };

    await this.mailerService.sendMail(mailOptions);
  }
}
