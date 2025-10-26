import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import type { Request, Response } from 'express';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  private setRefreshCookie(res: Response, token: string) {
    res.cookie('refresh_token', token, {
      httpOnly: true,
      secure: false, 
      sameSite: 'lax',
      path: '/auth/refresh',
      maxAge: 7 * 24 * 3600 * 1000, 
    });
  }

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    const result = await this.auth.register(dto);
    return result; 
  }
  @Post('login')
  @HttpCode(200)
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.auth.login(dto);
    // ⚠️ Nếu service ném lỗi UnauthorizedException (OTP chưa active)
    // Nest sẽ tự trả HTTP 401 về FE, không cần catch ở đây.
    // ✅ Nếu login hợp lệ → set refresh token
    if (result.refresh) {
      this.setRefreshCookie(res, result.refresh);
    }

    return {
      message: 'Đăng nhập thành công',
      user: result.user,
      access: result.access,
    };
  }

@Post('refresh')
async refresh(@Req() req: Request) {
  const refreshToken = (req as any).cookies?.['refresh_token'] as string | undefined;
  if (!refreshToken) {
    throw new UnauthorizedException('Thiếu refresh token');
  }
  const { access } = await this.auth.refreshToken(refreshToken);
  return { access };
}

 @Post('logout')
    @HttpCode(200)
    logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('refresh_token', { path: '/auth/refresh' });
    return { message: 'Đăng xuất thành công' };
}
@Post('verify-otp')
  async verifyOtp(@Body() body: { email: string; otp: string }) {
    const { email, otp } = body;
    if (!email || !otp) {
      throw new BadRequestException('Thiếu email hoặc mã OTP');
    }
    const result = await this.auth.verifyOtp(email, otp);
    return result; // { message: 'Xác thực email thành công!' }
  }
  @Post('resend-otp')
  async resendOtp(@Body() body: { email: string }) {
    const { email } = body; 
    if (!email) {
      throw new BadRequestException('Thiếu email');
    }
    const result = await this.auth.resendOtp(email);
    return result; // { message: 'OTP đã được gửi lại' }
  }
}
