import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { CouponsService } from './coupons.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { AdminGuard } from '../../shared/guards/admin.guard';

@Controller('coupons')
@UseGuards(AdminGuard)
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  @Get()
  findAll() {
    return this.couponsService.findAll();
  }

  @Post()
  create(@Body() dto: CreateCouponDto) {
    return this.couponsService.create(dto);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCouponDto) {
    return this.couponsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.couponsService.remove(id);
  }

  @Get('search')
  search(
    @Query('code') code?: string,
    @Query('type') type?: 'PERCENT' | 'AMOUNT',
    @Query('valid') validStr?: string,
  ) {
    let valid: boolean | undefined = undefined;
    if (typeof validStr === 'string') {
      const v = validStr.trim().toLowerCase();
      if (v === 'true' || v === '1' || v === 'valid' || v === 'conhan') valid = true;
      else if (v === 'false' || v === '0' || v === 'expired' || v === 'hethan') valid = false;
    }
    return this.couponsService.search({ code, type, valid });
  }
}
