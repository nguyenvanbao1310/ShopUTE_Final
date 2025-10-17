import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
  ) {}

  findAll() {
    return this.orderRepo.find({
      relations: ['details'],
      order: { createdAt: 'DESC' },
    });
  }

  findOne(id: number) {
    return this.orderRepo.findOne({
      where: { id },
      relations: ['details'],
    });
  }

  async updateStatus(id: number, status: string) {
    const order = await this.orderRepo.findOne({ where: { id } });
    if (!order) throw new NotFoundException('Order not found');
    order.status = status;
    return this.orderRepo.save(order);
  }
}