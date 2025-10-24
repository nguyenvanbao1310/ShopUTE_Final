import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../orders/entities/order.entity';
import { OrderDetail } from '../orders/entities/order-detail.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Product } from '../products/entities/product.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @InjectRepository(OrderDetail) private orderDetailRepo: Repository<OrderDetail>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Product) private productRepo: Repository<Product>,
  ) {}

  // 📊 Doanh thu theo tháng
  async getRevenueByMonth() {
    return await this.orderRepo.query(`
      SELECT DATE_FORMAT(createdAt, '%Y-%m') AS month,
             SUM(finalAmount) AS revenue
      FROM orders
      WHERE status = 'COMPLETED'
      GROUP BY month
      ORDER BY month;
    `);
  }

  // 💰 Dòng tiền (đang giao, đã giao)
  async getOrderCashFlow() {
    const [shipping, completed] = await Promise.all([
      this.orderRepo.query(`SELECT SUM(finalAmount) AS shipping FROM orders WHERE status = 'SHIPPED'`),
      this.orderRepo.query(`SELECT SUM(finalAmount) AS completed FROM orders WHERE status = 'COMPLETED'`),
    ]);

    return {
      shipping: shipping[0].shipping ?? 0,
      completed: completed[0].completed ?? 0,
      total: (shipping[0].shipping ?? 0) + (completed[0].completed ?? 0),
    };
  }

  // 👤 Khách hàng mới trong 30 ngày
  async getNewCustomers() {
    return await this.userRepo.query(`
      SELECT COUNT(*) AS newUsers
      FROM users
      WHERE createdAt >= DATE_SUB(NOW(), INTERVAL 30 DAY);
    `);
  }

  // 🏆 Top 10 sản phẩm bán chạy
  async getTopProducts() {
    return await this.orderDetailRepo.query(`
      SELECT p.id, p.name, SUM(od.quantity) AS totalSold
      FROM order_details od
      JOIN products p ON p.id = od.productId
      JOIN orders o ON o.id = od.orderId
      WHERE o.status = 'COMPLETED'
      GROUP BY p.id
      ORDER BY totalSold DESC
      LIMIT 10;
    `);
  }
}
