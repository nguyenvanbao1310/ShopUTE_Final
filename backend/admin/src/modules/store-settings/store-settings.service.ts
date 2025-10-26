// src/modules/store-settings/store-settings.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';

@Injectable()
export class StoreSettingsService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  // 🧑‍💼 Hồ sơ admin
  async getProfile() {
    const admin = await this.userRepo.findOne({ where: { role: 'admin' } });
    if (!admin) return { message: 'Admin not found' };

    return {
      firstName: admin.firstName,
      lastName: admin.lastName,
      email: admin.email,
      phone: admin.phone,
      gender: admin.gender || 'Không xác định',
      avatarUrl: admin.avatar_url
        ? `http://localhost:8081/images/${admin.avatar_url}`
        : `http://localhost:8081/images/default.png`,
    };
  }
  async updateProfile(body: any) {
  const admin = await this.userRepo.findOne({ where: { role: 'admin' } });
  if (!admin) throw new Error('Admin not found');

  const genderMap: Record<string, number> = {
    Nam: 1,
    Nữ: 2,
    'Không xác định': 0,
    Unknown: 0,
  };

  const genderValue =
    typeof body.gender === 'string'
      ? genderMap[body.gender] ?? parseInt(body.gender, 10)
      : body.gender ?? 0;

  // ✅ dùng update để chắc chắn ghi xuống DB
  await this.userRepo.update(
    { id: admin.id },
    {
      firstName: body.firstName ?? admin.firstName,
      lastName: body.lastName ?? admin.lastName,
      phone: body.phone ?? admin.phone,
      gender: genderValue,
    },
  );

  const updated = await this.userRepo.findOne({ where: { id: admin.id } });

  return {
    message: 'Cập nhật hồ sơ thành công!',
    admin: updated,
  };
}


  // ⏰ Giờ làm việc (code cứng tạm)
  getTiming() {
    return [
      { day: 'Thứ 2', open: '08:00', close: '18:00' },
      { day: 'Thứ 3', open: '08:00', close: '18:00' },
      { day: 'Thứ 4', open: '08:00', close: '18:00' },
      { day: 'Thứ 5', open: '08:00', close: '18:00' },
      { day: 'Thứ 6', open: '08:00', close: '18:00' },
      { day: 'Thứ 7', open: '09:00', close: '16:00' },
      { day: 'Chủ nhật', open: 'Nghỉ', close: '' },
    ];
  }

  // 📞 Liên hệ
  getContact() {
    return {
      email: 'support@shopute.vn',
      phone: '0909 888 777',
      facebook: 'https://facebook.com/shopute',
      zalo: 'https://zalo.me/0909888777',
      address: '1 Võ Văn Ngân, TP. Thủ Đức, TP. HCM',
    };
  }

  // 📜 Chính sách
  getPolicies() {
    return {
      warranty: 'Bảo hành 12 tháng chính hãng.',
      return: 'Đổi trả trong 7 ngày nếu có lỗi.',
      privacy: 'Không chia sẻ thông tin khách hàng cho bên thứ ba.',
      terms: 'Sử dụng website đồng nghĩa với việc chấp nhận điều khoản.',
    };
  }
  
}
