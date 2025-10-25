import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { mailTransporter } from './mailer.config';
import * as fs from 'fs-extra';
import * as handlebars from 'handlebars';
import * as path from 'path';

@Injectable()
export class MailService {
  private readonly fromName = process.env.MAIL_FROM_NAME || 'CVHub System';
  private readonly fromEmail = process.env.MAIL_USER;

  private async renderTemplate(templateName: string, context: any): Promise<string> {
    const templatePath = path.join(__dirname, 'templates', `${templateName}.hbs`);
    const source = (await fs.readFile(templatePath, 'utf8')) as string;
    const compiled = handlebars.compile(source);
    return compiled(context);
  }

  async sendMail(to: string, subject: string, html: string) {
    try {
      await mailTransporter.sendMail({
        from: `"${this.fromName}" <${this.fromEmail}>`,
        to,
        subject,
        html,
      });
    } catch (err) {
      console.error('❌ Lỗi gửi mail:', err);
      throw new InternalServerErrorException('Không thể gửi email');
    }
  }

  async sendOtpEmail(to: string, otp: string) {
    const html = await this.renderTemplate('otp', { otp, year: new Date().getFullYear() });
    await this.sendMail(to, 'Mã xác thực OTP của bạn', html);
  }

  async sendResetPasswordEmail(to: string, resetLink: string) {
    const html = await this.renderTemplate('reset-password', { resetLink, year: new Date().getFullYear() });
    await this.sendMail(to, 'Đặt lại mật khẩu tài khoản của bạn', html);
  }
  
}
