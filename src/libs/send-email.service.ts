import { Injectable } from '@nestjs/common';
import * as ejs from 'ejs';
import * as nodemailer from 'nodemailer';
import * as path from 'path';
// import {EmailOptionTypes} from "../types";
export interface EmailOptionTypes {
  email: string;
  subject: string;
  template: string;
  data: { [key: string]: any };
}
@Injectable()
export class SendMailService {
  async sendEmail(options: EmailOptionTypes): Promise<void> {
    const transporter: nodemailer.Transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      service: process.env.SMTP_SERVICE,
      auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASS,
      },
    });

    const { data, email, subject, template } = options;

    const templatePath = path.join(
      __dirname,
      '../../mails_template/',
      template,
    );

    const html: string = await ejs.renderFile(templatePath, data);

    const mailOption = {
      form: process.env.SMTP_MAIL,
      to: email,
      subject,
      html,
    };

    await transporter.sendMail(mailOption);
  }
}
