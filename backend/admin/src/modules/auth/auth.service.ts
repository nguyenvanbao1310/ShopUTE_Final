import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/enitites/user.entity';
import { JwtUserPayload } from './../../shared/guards/jwt-payload.type';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private users: UsersService,
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

    // 3️⃣ Tạo user mới
    const user = await this.users
      .create({
        email: dto.email.trim().toLowerCase(),
        firstName: dto.firstName?.trim() || 'Admin',
        lastName: dto.lastName?.trim() || 'User',
        phone: dto.phone?.trim() ?? undefined,
        password: hashed,
        role: 'admin',
        isActive: true,
      })
      .catch((err) => {
        console.error('❌ Lỗi khi tạo user:', err);
        throw new InternalServerErrorException('Không thể tạo tài khoản');
      });
    // 5️⃣ Trả về response an toàn
    return {
      message: 'Đăng ký thành công',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
      },
    };
  }

  async login(dto: LoginDto) {
    const user = await this.users.findByEmail(dto.email) as User;
    if (!user) throw new UnauthorizedException('Sai email hoặc mật khẩu');

    const match = await bcrypt.compare(dto.password, user.password);
    if (!match) throw new UnauthorizedException('Sai email hoặc mật khẩu');

    if (!user.isActive)
      throw new UnauthorizedException('Tài khoản đã bị vô hiệu hóa');

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
}
