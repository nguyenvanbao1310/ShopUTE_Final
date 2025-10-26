import { Controller, Get } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('revenue')
  getRevenue() {
    return this.analyticsService.getRevenueByMonth();
  }

  @Get('cashflow')
  getCashFlow() {
    return this.analyticsService.getOrderCashFlow();
  }

  @Get('customers')
  getNewCustomers() {
    return this.analyticsService.getNewCustomers();
  }

  @Get('top-products')
  getTopProducts() {
    return this.analyticsService.getTopProducts();
  }
  @Get('orders')
    getTotalOrders() {
    return this.analyticsService.getTotalOrders();
    }
    @Get('products')
    getAvailableProducts() {
    return this.analyticsService.getAvailableProducts();
    }
    @Get('sales-by-location')
getSalesByLocation() {
  return this.analyticsService.getSalesByLocation();
}
  @Get('forecast')
  async getRevenueForecast() {
    return await this.analyticsService.getRevenueForecast();
  }

}
