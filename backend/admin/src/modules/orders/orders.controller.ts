import { Controller, Get, Query, Param, Patch, Body } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Order } from './entities/order.entity';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 7,
    @Query('search') search = '',
  ): Promise<{
    data: Order[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    return await this.ordersService.findAll(
      Number(page),
      Number(limit),
      search,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.ordersService.findOne(id);
  }

  @Patch('status/:id')
  updateStatus(@Param('id') id: number, @Body('status') status: string) {
    return this.ordersService.updateStatus(id, status);
  }
}
