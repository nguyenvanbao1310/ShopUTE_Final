import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../orders/entities/order.entity';
import { OrderDetail } from '../orders/entities/order-detail.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Product } from '../products/entities/product.entity';
import axios from 'axios';
import { InventoryAlert } from './types/inventory-alert.type';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @InjectRepository(OrderDetail) private orderDetailRepo: Repository<OrderDetail>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Product) private productRepo: Repository<Product>,
    
  ) {}

  // 📊 Doanh thu theo tháng + xu hướng tăng/giảm so với tháng trước
async getRevenueByMonth() {
  // --- 1. Lấy doanh thu tháng hiện tại
  const [current] = await this.orderRepo.query(`
    SELECT SUM(finalAmount) AS total
    FROM orders
    WHERE status = 'COMPLETED'
      AND MONTH(createdAt) = MONTH(NOW())
      AND YEAR(createdAt) = YEAR(NOW());
  `);
  const currentRevenue = Number(current.total) || 0;

  // --- 2. Lấy doanh thu tháng trước
  const [previous] = await this.orderRepo.query(`
    SELECT SUM(finalAmount) AS total
    FROM orders
    WHERE status = 'COMPLETED'
      AND MONTH(createdAt) = MONTH(DATE_SUB(NOW(), INTERVAL 1 MONTH))
      AND YEAR(createdAt) = YEAR(DATE_SUB(NOW(), INTERVAL 1 MONTH));
  `);
  const previousRevenue = Number(previous.total) || 0;

  // --- 3. Tính toán xu hướng (trend + trendValue)
  let trendValue = 0;
  let trend: 'up' | 'down' | 'neutral' = 'neutral';

  if (previousRevenue === 0 && currentRevenue > 0) {
    trend = 'up';
    trendValue = 100;
  } else if (previousRevenue > 0) {
    trendValue = ((currentRevenue - previousRevenue) / previousRevenue) * 100;
    trend = currentRevenue >= previousRevenue ? 'up' : 'down';
  }

  // --- 4. Lấy dữ liệu doanh thu theo từng tháng để vẽ biểu đồ
  const monthlyRevenue = await this.orderRepo.query(`
    SELECT DATE_FORMAT(createdAt, '%Y-%m') AS month,
           SUM(finalAmount) AS revenue
    FROM orders
    WHERE status = 'COMPLETED'
    GROUP BY month
    ORDER BY month;
  `);

  return {
    currentRevenue,
    trend,
    trendValue: parseFloat(Math.abs(trendValue).toFixed(2)),
    monthlyRevenue,
  };
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

  // 👤 Khách hàng mới trong 30 ngày + xu hướng so với 30 ngày trước
async getNewCustomers() {
  // --- 1. Đếm khách hàng trong 30 ngày gần nhất
  const currentResult = await this.userRepo.query(`
    SELECT COUNT(*) AS count
    FROM users
    WHERE createdAt >= DATE_SUB(NOW(), INTERVAL 30 DAY);
  `);
  const currentCount = Number(currentResult[0].count) || 0;

  // --- 2. Đếm khách hàng của 30 ngày liền trước (30-60 ngày)
  const previousResult = await this.userRepo.query(`
    SELECT COUNT(*) AS count
    FROM users
    WHERE createdAt BETWEEN DATE_SUB(NOW(), INTERVAL 60 DAY)
      AND DATE_SUB(NOW(), INTERVAL 30 DAY);
  `);
  const previousCount = Number(previousResult[0].count) || 0;

  // --- 3. Tính toán xu hướng (trend + trendValue)
  let trendValue = 0;
  let trend: 'up' | 'down' | 'neutral' = 'neutral';

  if (previousCount === 0 && currentCount > 0) {
    trend = 'up';
    trendValue = 100;
  } else if (previousCount > 0) {
    trendValue = ((currentCount - previousCount) / previousCount) * 100;
    trend = currentCount >= previousCount ? 'up' : 'down';
  }

  return {
    newCustomers: currentCount,
    trend,
    trendValue: parseFloat(Math.abs(trendValue).toFixed(2)),
  };
}



  // 🏆 Top 10 sản phẩm bán chạy
  async getTopProducts() {
  return await this.orderDetailRepo.query(`
    SELECT p.id, p.name, p.thumbnailUrl AS imageUrl, SUM(od.quantity) AS totalSold,p.price
    FROM order_details od
    JOIN products p ON p.id = od.productId
    JOIN orders o ON o.id = od.orderId
    WHERE o.status = 'COMPLETED'
    GROUP BY p.id, p.thumbnailUrl
    ORDER BY totalSold DESC
    LIMIT 10;
  `);
}

   // 📦 Tổng số đơn hàng + xu hướng tăng giảm theo tháng
  async getTotalOrders() {
    // Lấy tháng hiện tại và tháng trước
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();
    const prevMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const prevYear = currentMonth === 1 ? currentYear - 1 : currentYear;

    // Đếm đơn hàng tháng này
    const [current] = await this.orderRepo.query(`
      SELECT COUNT(*) AS total
      FROM orders
      WHERE MONTH(createdAt) = ${currentMonth}
        AND YEAR(createdAt) = ${currentYear};
    `);

    // Đếm đơn hàng tháng trước
    const [previous] = await this.orderRepo.query(`
      SELECT COUNT(*) AS total
      FROM orders
      WHERE MONTH(createdAt) = ${prevMonth}
        AND YEAR(createdAt) = ${prevYear};
    `);

    const currentCount = Number(current.total) || 0;
    const prevCount = Number(previous.total) || 0;

    const trendValue =
      prevCount === 0 ? 100 : ((currentCount - prevCount) / prevCount) * 100;
    const trend = currentCount >= prevCount ? 'up' : 'down';

    return {
      totalOrders: currentCount,
      trend,
      trendValue: parseFloat(trendValue.toFixed(2)),
    };
  }
  // 📦 Sản phẩm có sẵn + xu hướng tăng/giảm
async getAvailableProducts() {
  // Đếm số sản phẩm còn hàng (>0)
  const [current] = await this.productRepo.query(`
    SELECT COUNT(*) AS total
    FROM products
    WHERE stock > 0;
  `);

  const currentCount = Number(current.total) || 0;

  // Đếm sản phẩm còn hàng của tháng trước (dựa theo createdAt)
  const [previous] = await this.productRepo.query(`
    SELECT COUNT(*) AS total
    FROM products
    WHERE stock > 0
      AND MONTH(createdAt) = MONTH(DATE_SUB(NOW(), INTERVAL 1 MONTH))
      AND YEAR(createdAt) = YEAR(DATE_SUB(NOW(), INTERVAL 1 MONTH));
  `);

  const prevCount = Number(previous.total) || 0;

  const trendValue =
    prevCount === 0 ? 100 : ((currentCount - prevCount) / prevCount) * 100;
  const trend = currentCount >= prevCount ? 'up' : 'down';

  return {
    availableProducts: currentCount,
    trend,
    trendValue: parseFloat(Math.abs(trendValue).toFixed(2)),
  };
}
// 📍 Doanh số theo địa điểm (tính % doanh thu theo city)
async getSalesByLocation() {
  const result = await this.orderRepo.query(`
    SELECT 
      deliveryAddress AS name,
      ROUND(SUM(finalAmount) / (SELECT SUM(finalAmount) FROM orders WHERE status = 'COMPLETED') * 100, 1) AS percent
    FROM orders
    WHERE status = 'COMPLETED' 
      AND deliveryAddress IS NOT NULL
    GROUP BY deliveryAddress
    ORDER BY percent DESC;
  `);

  return result.map((row) => ({
    name: row.name || 'Không xác định',
    percent: Number(row.percent) || 0,
  }));
}
 // 📈 Dự đoán doanh thu (AI Prophet)
  async getRevenueForecast() {
    // 1️⃣ Lấy doanh thu từng tháng
    const data = await this.orderRepo.query(`
      SELECT DATE_FORMAT(createdAt, '%Y-%m') AS month,
             SUM(finalAmount) AS revenue
      FROM orders
      WHERE status IN ('COMPLETED', 'SHIPPED')
      GROUP BY DATE_FORMAT(createdAt, '%Y-%m')
      ORDER BY month;
    `);

    // 2️⃣ Gọi Flask service
    const res = await axios.post('http://127.0.0.1:5001/forecast', data);

    return {
      history: data,
      forecast: res.data,
    };
  }
// 📦 Dự đoán tồn kho (AI)
// 📦 Dự đoán tồn kho (AI)
async getInventoryAlerts(): Promise<InventoryAlert[]> {
  const alerts: InventoryAlert[] = [];
  
  const products = await this.productRepo.query(`
    SELECT 
      p.id AS productId, 
      p.name AS productName, 
      p.stock AS currentStock
    FROM products p
    WHERE p.stock IS NOT NULL AND p.stock > 0
  `);

  console.log(`📦 Tổng số sản phẩm cần dự đoán: ${products.length}`);

  for (const p of products) {
    try {
      // Lấy lịch sử bán hàng
      const history = await this.orderDetailRepo.query(`
        SELECT 
          DATE_FORMAT(o.createdAt, '%Y-%m') AS month,
          COALESCE(SUM(od.quantity), 0) AS sold,
          ${p.currentStock} AS stock
        FROM order_details od
        JOIN orders o ON o.id = od.orderId
        WHERE o.status IN ('COMPLETED', 'SHIPPED')
          AND od.productId = ${p.productId}
          AND o.createdAt >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
        GROUP BY month
        ORDER BY month
        LIMIT 6
      `);

      // Xử lý dữ liệu ít
      let processedHistory: any[] = history;
      
      if (history.length === 0) {
        console.log(`🔄 Tạo dữ liệu mẫu cho ${p.productName}`);
        processedHistory = this.generateSampleData(p.currentStock);
      } else if (history.length === 1) {
        console.log(`🔄 Bổ sung dữ liệu mẫu cho ${p.productName}`);
        processedHistory = this.complementSampleData(history, p.currentStock);
      }

      console.log(`📊 ${p.productName}: có ${processedHistory.length} tháng dữ liệu`);

      if (processedHistory.length < 2) {
        console.log(`⚠️ Bỏ qua ${p.productName}: không đủ dữ liệu lịch sử`);
        continue;
      }

      // Gọi Flask AI
      console.log(`🔄 Gọi AI cho ${p.productName}...`);
      const res = await axios.post(
        'http://127.0.0.1:5002/inventory-forecast',
        processedHistory,
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 30000
        }
      );

      const forecast = res.data;
      console.log(`🔮 Kết quả dự đoán cho ${p.productName}:`, forecast);

      // Kiểm tra cảnh báo
      const criticalMonths = forecast.filter((f: any) => f.predicted_stock <= 2);
      
      if (criticalMonths.length > 0) {
        const firstCritical = criticalMonths[0];
        const alertLevel = firstCritical.predicted_stock <= 0 ? 'HIGH' : 
                          firstCritical.predicted_stock <= 1 ? 'MEDIUM' : 'LOW';
        
        alerts.push({
          productId: p.productId,
          productName: p.productName,
          currentStock: p.currentStock,
          outOfStockMonth: firstCritical.month,
          predicted_sold: firstCritical.predicted_sold,
          alertLevel: alertLevel
        });
        
        console.log(`🚨 CẢNH BÁO ${alertLevel}: ${p.productName} sẽ hết hàng vào ${firstCritical.month}`);
      } else {
        console.log(`✅ ${p.productName}: đủ hàng trong 3 tháng tới`);
      }

    } catch (err: any) {
      console.error(`❌ Lỗi khi dự đoán tồn kho cho ${p.productName}:`, err.message);
    }
  }

  console.log(`📋 Tổng số cảnh báo: ${alerts.length}`);
  return alerts;
}

// 🔹 Sửa lỗi TypeScript - thêm type cho hàm
private generateSampleData(currentStock: number): Array<{month: string; sold: number; stock: number}> {
  const months: Array<{month: string; sold: number; stock: number}> = [];
  const now = new Date();
  
  for (let i = 2; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const month = date.toISOString().slice(0, 7);
    const sold = Math.floor(Math.random() * 5) + 1;
    
    months.push({
      month: month,
      sold: sold,
      stock: currentStock
    });
  }
  
  return months;
}

// 🔹 Sửa lỗi TypeScript - thêm type cho hàm
private complementSampleData(existingData: any[], currentStock: number): Array<{month: string; sold: number; stock: number}> {
  const months: Array<{month: string; sold: number; stock: number}> = [...existingData];
  const lastDate = new Date(existingData[0].month + '-01');
  
  for (let i = 1; i <= 2; i++) {
    const date = new Date(lastDate.getFullYear(), lastDate.getMonth() - i, 1);
    const month = date.toISOString().slice(0, 7);
    const baseSold = existingData[0].sold;
    const sold = Math.max(1, Math.floor(baseSold * (0.8 + Math.random() * 0.4)));
    
    months.unshift({
      month: month,
      sold: sold,
      stock: currentStock
    });
  }
  
  return months;
}

}
