import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../orders/entities/order.entity';

type NotificationListItem = {
  id: number;
  orderId: number;
  customerId: number | null;
  status: string;
  createdAt: Date;
  title: string;
  message: string;
};

type RawOrderRow = {
  orderId: number;
  customerId: number | null;
  code: string | null;
  status: 'PENDING' | 'CANCEL_REQUESTED';
  createdAt: Date;
  firstName: string | null;
  lastName: string | null;
};

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
  ) {}

  async findFromOrders(): Promise<NotificationListItem[]> {
    const qb = this.orderRepo
      .createQueryBuilder('o')
      .leftJoin('users', 'u', 'u.id = o.userId')
      .select([
        'o.id AS orderId',
        'o.userId AS customerId',
        'o.code AS code',
        'o.status AS status',
        'o.createdAt AS createdAt',
        'u.firstName AS firstName',
        'u.lastName AS lastName',
      ])
      .where('o.status IN (:...statuses)', {
        statuses: ['PENDING', 'CANCEL_REQUESTED'],
      })
      .orderBy('o.createdAt', 'DESC');

    const rows = await qb.getRawMany<RawOrderRow>();

    const titleOf = (s: string) =>
      s === 'PENDING' ? 'Chờ xác nhận' : 'Yêu cầu hủy';
    const verbOf = (s: string) =>
      s === 'PENDING' ? 'yêu cầu tạo đơn hàng' : 'yêu cầu hủy đơn hàng';

    return rows.map((r) => {
      const name =
        `${r.firstName ?? ''} ${r.lastName ?? ''}`.trim() ||
        `KH#${r.customerId ?? ''}`;
      const code = r.code ?? `#${r.orderId}`;
      return {
        id: r.orderId,
        orderId: r.orderId,
        customerId: r.customerId,
        status: r.status,
        createdAt: r.createdAt,
        title: titleOf(r.status),
        message: `${name} ${verbOf(r.status)} ${code}`,
      };
    });
  }
}
