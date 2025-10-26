import * as nodemailer from 'nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';
import type { Transporter } from 'nodemailer';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
export const mailTransporter: Transporter<SMTPTransport.SentMessageInfo> =
  nodemailer.createTransport<SMTPTransport.Options>({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });