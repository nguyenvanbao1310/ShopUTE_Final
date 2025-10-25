import { Injectable } from '@nestjs/common';
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
    const entity = this.couponRepo.create(dto as Partial<Coupon>);
    return this.couponRepo.save(entity);
  }

  async update(id: number, dto: UpdateCouponDto): Promise<Coupon | null> {
    await this.couponRepo.update(id, dto as Partial<Coupon>);
    return this.couponRepo.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.couponRepo.delete(id);
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
