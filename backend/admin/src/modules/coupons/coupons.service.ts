import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Coupon } from './entities/coupon.entity';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';

@Injectable()
export class CouponsService {
  constructor(
    @InjectRepository(Coupon)
    private readonly couponRepo: Repository<Coupon>,
  ) {}

  async findAll(): Promise<Coupon[]> {
    return this.couponRepo.find({ order: { id: 'DESC' } });
  }

  async create(dto: CreateCouponDto): Promise<Coupon> {
    const entity = this.couponRepo.create({
      code: dto.code,
      userId: dto.userId ?? null,
      type: dto.type,
      value: Number(dto.value),
      minOrderAmount: dto.minOrderAmount != null ? Number(dto.minOrderAmount) : null,
      maxDiscountValue: dto.maxDiscountValue != null ? Number(dto.maxDiscountValue) : null,
      expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
      isUsed: dto.isUsed ?? false,
      usedAt: dto.usedAt ? new Date(dto.usedAt) : null,
    });
    return this.couponRepo.save(entity);
  }

  async update(id: number, dto: UpdateCouponDto): Promise<Coupon> {
    const coupon = await this.couponRepo.findOne({ where: { id } });
    if (!coupon) throw new NotFoundException('Coupon not found');

    if (dto.code !== undefined) coupon.code = dto.code;
    if (dto.userId !== undefined) coupon.userId = dto.userId ?? null;
    if (dto.type !== undefined) coupon.type = dto.type;
    if (dto.value !== undefined) coupon.value = Number(dto.value);
    if (dto.minOrderAmount !== undefined)
      coupon.minOrderAmount = dto.minOrderAmount != null ? Number(dto.minOrderAmount) : null;
    if (dto.maxDiscountValue !== undefined)
      coupon.maxDiscountValue = dto.maxDiscountValue != null ? Number(dto.maxDiscountValue) : null;
    if (dto.expiresAt !== undefined) coupon.expiresAt = dto.expiresAt ? new Date(dto.expiresAt) : null;
    if (dto.isUsed !== undefined) coupon.isUsed = dto.isUsed;
    if (dto.usedAt !== undefined) coupon.usedAt = dto.usedAt ? new Date(dto.usedAt) : null;

    await this.couponRepo.save(coupon);
    return coupon;
  }

  async remove(id: number): Promise<void> {
    const res = await this.couponRepo.delete(id);
    if (!res.affected) throw new NotFoundException('Coupon not found');
  }

  async search(filters: {
    code?: string;
    type?: 'PERCENT' | 'AMOUNT';
    valid?: boolean; // true: còn hạn, false: hết hạn (theo expiresAt)
  }): Promise<Coupon[]> {
    const qb = this.couponRepo.createQueryBuilder('c');

    if (filters.code && filters.code.trim()) {
      qb.andWhere('c.code LIKE :code', { code: `%${filters.code.trim()}%` });
    }
    if (filters.type === 'PERCENT' || filters.type === 'AMOUNT') {
      qb.andWhere('c.type = :type', { type: filters.type });
    }
    if (typeof filters.valid === 'boolean') {
      const now = new Date();
      if (filters.valid) {
        qb.andWhere('(c.expiresAt IS NULL OR c.expiresAt >= :now)', { now });
      } else {
        qb.andWhere('c.expiresAt IS NOT NULL AND c.expiresAt < :now', { now });
      }
    }

    qb.orderBy('c.createdAt', 'DESC');
    return qb.getMany();
  }
}
