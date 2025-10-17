import { Controller, Get, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { AdminGuard } from '../../shared/guards/admin.guard';

@Controller('notifications')
@UseGuards(AdminGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  // List unread notifications sorted by time desc
  @Get()
  getFromOrders() {
    return this.notificationsService.findFromOrders();
  }
}
