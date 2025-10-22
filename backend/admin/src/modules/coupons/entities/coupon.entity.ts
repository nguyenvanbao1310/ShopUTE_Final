import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export type CouponType = 'PERCENT' | 'AMOUNT';

@Entity('coupons')
export class Coupon {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 50, unique: true })
  code: string;

  @Column({ type: 'int', unsigned: true, nullable: true })
  userId: number | null;

  @Column({ type: 'enum', enum: ['PERCENT', 'AMOUNT'], default: 'PERCENT' })
  type: CouponType;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  value: number;

  @Column({ type: 'decimal', precision: 14, scale: 2, nullable: true })
  minOrderAmount: number | null;

  @Column({ type: 'decimal', precision: 14, scale: 2, nullable: true })
  maxDiscountValue: number | null;

  @Column({ type: 'datetime', nullable: true })
  expiresAt: Date | null;

  @Column({ type: 'boolean', default: false })
  isUsed: boolean;

  @Column({ type: 'datetime', nullable: true })
  usedAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
