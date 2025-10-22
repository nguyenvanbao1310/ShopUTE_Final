import { Controller, Get, Param, Patch, Body } from '@nestjs/common';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  findAll() {
    return this.ordersService.findAll();
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
