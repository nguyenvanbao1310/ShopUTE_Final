import { Controller, Get, Param } from '@nestjs/common';
import { ProductImageService } from './productImage.service';

@Controller('product-images')
export class ProductImageController {
  constructor(private readonly productImageService: ProductImageService) {}

  // Lấy toàn bộ ảnh phụ
  @Get('all')
  async getAll() {
    return this.productImageService.findAll();
  }

  // Lấy ảnh theo productId
  @Get(':productId')
  async getByProductId(@Param('productId') productId: number) {
    return this.productImageService.findByProductId(productId);
  }
}
