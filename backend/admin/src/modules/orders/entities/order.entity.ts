import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrderDetail } from './order-detail.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  userId: number;

  @Column({ unique: true })
  code: string;

  @Column('decimal', { precision: 14, scale: 2 })
  totalAmount: string;

  @Column('decimal', { precision: 14, scale: 2, nullable: true })
  discountAmount: string;

  @Column('decimal', { precision: 14, scale: 2, nullable: true })
  shippingFee: string;

  @Column('decimal', { precision: 14, scale: 2, nullable: true })
  finalAmount: string;

  @Column({ default: 0 })
  usedPoints: number;

  @Column('decimal', { precision: 14, scale: 2, nullable: true })
  pointsDiscountAmount: string;

  @Column({ nullable: true })
  voucherId: number;

  @Column({ nullable: true })
  shippingMethodId: number;

  @Column({
    type: 'enum',
    enum: [
      'PENDING',
      'CONFIRMED',
      'PREPARING',
      'CANCELLED',
      'SHIPPED',
      'COMPLETED',
      'CANCEL_REQUESTED',
    ],
    default: 'PENDING',
  })
  status: string;

  @Column({ nullable: true })
  paymentMethod: string;

  @Column({
    type: 'enum',
    enum: ['UNPAID', 'PAID', 'REFUNDED'],
    default: 'UNPAID',
  })
  paymentStatus: string;

  @Column({ type: 'text', nullable: true })
  note: string;

  @Column({ nullable: true })
  deliveryAddress: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => OrderDetail, (detail) => detail.order)
  details: OrderDetail[];
}
