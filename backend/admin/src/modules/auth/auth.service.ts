import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  InternalServerErrorException,
  ForbiddenException,NotFoundException, BadRequestException, 
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity'
import { JwtUserPayload } from './../../shared/guards/jwt-payload.type';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private users: UsersService,
    private readonly mailService: MailService,
    private jwt: JwtService,
  ) {}

  private async signAccess(user: User) {
    const payload: JwtUserPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    return await this.jwt.signAsync(payload, {
      secret: process.env.JWT_SECRET!,
      expiresIn: '15m',
    }) as string;
  }

  private async signRefresh(user: User) {
    const payload: JwtUserPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    return await this.jwt.signAsync(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '7d',
    }) as string;
  }

   async register(dto: RegisterDto) {
    // 1️⃣ Kiểm tra email hợp lệ và trùng
    const existed = await this.users.findByEmail(dto.email.trim().toLowerCase());
    if (existed) throw new ConflictException('Email đã tồn tại trong hệ thống');

    // 2️⃣ Hash mật khẩu
    const hashed = await bcrypt.hash(dto.password, 10) as string;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpire = new Date(Date.now() + 10 * 60 * 1000);
    // 3️⃣ Tạo user mới
    const user = await this.users
      .create({
        email: dto.email.trim().toLowerCase(),
        firstName: dto.firstName?.trim() || 'Admin',
        lastName: dto.lastName?.trim() || 'User',
        phone: dto.phone?.trim() ?? undefined,
        password: hashed,
        role: 'admin',
        otp,
        otpExpire,
        isActive: false,
      })
      .catch((err) => {
        console.error('❌ Lỗi khi tạo user:', err);
        throw new InternalServerErrorException('Không thể tạo tài khoản');
      });
    await this.mailService.sendOtpEmail(user.email, otp);
    return { message: 'Vui lòng kiểm tra email để xác thực tài khoản' };
  }

  

  async login(dto: LoginDto) {
    const user = await this.users.findByEmail(dto.email) as User;
    if (!user) throw new UnauthorizedException('Sai email hoặc mật khẩu');

    const match = await bcrypt.compare(dto.password, user.password);
    if (!match) throw new UnauthorizedException('Sai email hoặc mật khẩu');

    if (!user.isActive && !user.otp && !user.otpExpire) {
      throw new UnauthorizedException('Tài khoản đã bị vô hiệu hóa');
  }

  if (!user.isActive && user.otp) {
    const now = new Date();

    // OTP đã hết hạn → tạo mới và gửi lại
    if (!user.otpExpire || user.otpExpire < now) {
      const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
      user.otp = newOtp;
      user.otpExpire = new Date(now.getTime() + 10 * 60 * 1000); // +10 phút
      await this.users.save(user);

      await this.mailService.sendOtpEmail(user.email, newOtp);
      throw new UnauthorizedException('OTP đã hết hạn. Hệ thống đã gửi mã mới đến email của bạn.');
    }

    // OTP vẫn còn hạn → gửi lại mail OTP
    await this.mailService.sendOtpEmail(user.email, user.otp);
    throw new UnauthorizedException('Tài khoản chưa được xác thực. Vui lòng kiểm tra email để nhập OTP.');
  }

    const [access, refresh] = await Promise.all([
      this.signAccess(user),
      this.signRefresh(user),
    ]);

    return { user, access, refresh };
  }

  async refreshToken(refreshToken: string) {
    try {
      const decoded = await this.jwt.verifyAsync<JwtUserPayload>(refreshToken, {
        secret: process.env.JWT_SECRET,
      }) as JwtUserPayload;
      const user = await this.users.findById(decoded.sub) as User;
      if (!user) throw new UnauthorizedException('User không tồn tại');

      const newAccess = await this.signAccess(user);
      return { access: newAccess };
    } catch {
      throw new UnauthorizedException('Refresh token không hợp lệ');
    }
  }

  async verifyOtp(email: string, otp: string) {
    const user = await this.users.findByEmail(email);
    if (!user) throw new NotFoundException('Không tìm thấy tài khoản');

    // 1️⃣ Kiểm tra nếu tài khoản đã active
    if (user.isActive) throw new BadRequestException('Tài khoản đã được kích hoạt');

    // 2️⃣ Kiểm tra nếu bị admin vô hiệu hóa
    if (!user.otp && !user.otpExpire)
      throw new ForbiddenException('Tài khoản bị vô hiệu hóa bởi quản trị viên');

    // 3️⃣ Kiểm tra OTP
    if (!user.otpExpire || user.otpExpire < new Date()) {
    throw new BadRequestException('OTP đã hết hạn');
  }

    if (user.otp !== otp)
      throw new BadRequestException('OTP không đúng');
    user.isActive = true;
    user.otp = null;
    user.otpExpire = null;
    await this.users.save(user);

    return { message: 'Xác thực email thành công!' };
  }
  async resendOtp(email: string) {
    const user = await this.users.findByEmail(email);
    if (!user) throw new NotFoundException('Không tìm thấy tài khoản');
    if (user.isActive) throw new BadRequestException('Tài khoản đã được kích hoạt');
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = newOtp;
    user.otpExpire = new Date(Date.now() + 10 * 60 * 1000);
    await this.users.save(user);
    await this.mailService.sendOtpEmail(user.email, newOtp);
    return { message: 'Mã OTP mới đã được gửi đến email của bạn.' };
  }

}
