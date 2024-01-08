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

/**
 *
 * @SendMailerService Require to install ejs & Nodemailer
 * @packageRef : https://www.npmjs.com/package/ejs  & https://www.npmjs.com/package/nodemailer
 *
 */
@Injectable()
export class SendMailService {
  /**
   *
   * @sendEmail  Received as a parameter @EmailOptionTypes which that will be
   * @param {EmailOptionTypes}: email subject, template, data{[key:string]: any}
   * @returns : Promise<void>
   */
  async sendEmail(options: EmailOptionTypes): Promise<void> {
    /**
     *
     *@transporter for connection
        SMTP_HOST= ex:smtp.gmail.com
        SMTP_PORT= ex:465
        SMTP_SERVICE= ex:gmail
        SMTP_MAIL= smtp email
        SMTP_PASS= smtp_password
     *
     */
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

    // const generateTempPathOption = path.join(__dirname, templatePath, template);

    // console.log(generateTempPathOption);
    const templatePath = process.cwd() + template;

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
