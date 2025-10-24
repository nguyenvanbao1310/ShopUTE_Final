import {
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
    const { user } = await this.auth.register(dto);
    return { user };
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const { user, access, refresh } = await this.auth.login(dto);
    this.setRefreshCookie(res, refresh);
    return { user, access };
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

}
