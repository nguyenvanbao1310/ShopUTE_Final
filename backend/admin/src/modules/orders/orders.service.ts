import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, FindOptionsWhere } from 'typeorm';
import { Order } from './entities/order.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
  ) {}

  async findAll(
    page: number,
    limit: number,
    search: string,
  ): Promise<{
    data: Order[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;

    let where: FindOptionsWhere<Order>[] | FindOptionsWhere<Order> = {};

    if (search) {
      const isNumber = !isNaN(Number(search));
      if (isNumber) {
        // 🔍 Nếu search là số → tìm theo ID
        where = { id: Number(search) };
      } else {
        // 🔍 Nếu search là chuỗi → tìm theo địa chỉ
        where = [{ deliveryAddress: ILike(`%${search}%`) }];
      }
    }

    const [data, total] = await this.orderRepo.findAndCount({
      where,
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  findOne(id: number) {
    return this.orderRepo.findOne({
      where: { id },
      relations: ['user', 'details', 'details.product'],
    });
  }

  async updateStatus(id: number, status: string) {
    const order = await this.orderRepo.findOne({ where: { id } });
    if (!order) throw new NotFoundException('Order not found');
    order.status = status;
    return this.orderRepo.save(order);
  }
}
